const express = require('express');
const Task = require('../models/task');
const router = new express.Router();


router.get("/tasks/:id", async (req, res) => {
    try {
        let task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch(e){
        res.status(400).send();
    }
})

router.get("/tasks", async (req, res) => {
    try {
        let tasks = await Task.find({})
        res.send(tasks)
    } catch(e){
        res.status(500).send()
    }
})

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save()
        res.status(201).send(task);
    } catch(e){
        res.status(400).send();
    }
});
router.delete('/tasks/:id',async (req,res)=>{
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if(!task){
            res.status(404).send()
        }
        res.send(task);
    } catch (e) {
        res.status(500).send();
    }
})
router.patch("/tasks/:id",async (req,res)=>{
   let updates = Object.keys(req.body);
   let requiredUpdates = ["description","completed"];

   let requiresUpdate = updates.every((update)=>{
    return requiredUpdates.includes(update)
   })
   if(!requiresUpdate){
       res.send(404).send();
   }
try {
//    let task = await Task.findByIdAndUpdate(req.params.id,req.body,{ new: true, runValidators: true});
let task = await Task.findById(req.params.id);
    if(!task){
        res.status(404).send();
    }
    updates.forEach((key)=>{
        task[key] = req.body[key]
    });
   await task.save()
   res.status(200).send(task);
} catch (e) {
    req.status().send()
}
})

module.exports = router;