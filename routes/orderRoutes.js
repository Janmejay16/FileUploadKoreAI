const OrderSchema = require('../models/order')
const { randomUUID } = require('crypto');
const router = require('express').Router();

router.get('/', (req, res) => {
    OrderSchema.find({})
    .then(data => res.status(200).json(data))
    .catch(err => {
        console.log(err)
        res.status(500).json({error: "Something went wrong!"})
    })
})

router.get('/capacity', async (req, res) => {
    try {
        let capacityUsed = await OrderSchema.aggregate(
            [
                {$group: {
                    _id: "$date",
                    TotalCapacity: {$sum: "$capacity"}
                }}
            ]
        )
        return res.status(200).json(capacityUsed)
    }
    catch(err) {
        console.log(err)
        res.status(500).json({Error: err})
    }
})

router.get('/checkCapacity/:date', async (req, res) => {
    try {
        let date = new Date(req.params.date)
        let capacityUsed = await OrderSchema.aggregate(
            [
                {$match: {date: date}},
                {$group: {
                    _id: "$date",
                    TotalCapacity: {$sum: "$capacity"}
                }}
            ]
        )
        return res.status(200).json({milkLeft: process.env.MAX_CAPACITY - capacityUsed[0].TotalCapacity})
    }
    catch(err) {
        console.log(err)
        res.status(500).json({Error: err})
    }
})

router.post('/add', async (req, res) => {
    let {orderedBy, capacity, date} = req.body
    date = date ? new Date(date) : Date.now()
    try {
        // Fetch Total Ordered Capacity of that day
        let capacityUsed = await OrderSchema.aggregate(
            [
                {$match: {date: date}},
                {$group: {
                    _id: randomUUID(),
                    TotalCapacity: {$sum: "$capacity"}
                }}
            ]
        )

        if(capacityUsed[0].TotalCapacity + capacity > process.env.MAX_CAPACITY) {
            return res.status(400).json({
                Error: `Daily Capacity is exceeding (Max Capacity = ${process.env.MAX_CAPACITY})!`,
                capacityUsed: capacityUsed[0].TotalCapacity,
                success: false
            })
        }

        // Create New Order
        else {
            let data = await OrderSchema.create({
                orderedBy: orderedBy,
                capacity: capacity,
                date: date ? new Date(date) : Date.now()
            })
            res.status(201).json(data)
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json({Error: err})
    }
})

router.put('/update/:id', async (req, res) => {
    let {id} = req.params
    const updateData = req.body

    try {
        // Find the Order by id
        let order = await OrderSchema.findById(id)
        let date = updateData.date ? new Date(updateData.date) : new Date(order.date)

        if(updateData.capacity) {
            // Fetch Total Ordered Capacity of that day
            let capacityUsed = await OrderSchema.aggregate(
                [
                    {$match: {date: date}},
                    {$group: {
                        _id: randomUUID(),
                        TotalCapacity: {$sum: "$capacity"}
                    }}
                ]
            )

            if(capacityUsed.length == 1 && capacityUsed[0].TotalCapacity + updateData.capacity > process.env.MAX_CAPACITY) {
                return res.status(400).json({
                    Error: `Daily Capacity is exceeding (Max Capacity = ${process.env.MAX_CAPACITY})!`,
                    capacityUsed: capacityUsed[0].TotalCapacity,
                    success: false
                })
            }
        }

        // Create New Order
        updateData.date = new Date(date)
        OrderSchema.updateOne(
            {_id: id},
            {...updateData}
        ).then(done => {
            if(done.modifiedCount)
                return res.status(200).json({message: "Updated"})
            else 
                return res.status(404).json({message: "Order not found!"})
        })
        .catch(err => {
            res.status(500).json({Error: err})
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({Error: err})
    }
})

router.delete('/delete/:id', async (req, res) => {
    let {id} = req.params
    try {
        OrderSchema.deleteOne({_id: id})
        .then(deleted => {
            console.log(deleted)
            if(deleted?.deletedCount) {
                return res.status(200).json({message: "Deleted"})
            }
            else {
                return res.status(404).json({message: "Order not found!"})
            }
        })
        .catch(err => {
            res.status(500).json({Error: err})
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({Error: err})
    }
})

module.exports = router;