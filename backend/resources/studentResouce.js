import Student from '../models/Student.js';
import express from 'express';
import * as errorMessages from '../constants/errorMessages.js';
const studentRouter = express.Router();

studentRouter.get('/students', async (req, res) => {
    try {
        const students = await Student.find().populate('skills').populate('achievements');
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: errorMessages.internalServerError });
    }
});

studentRouter.post('/students', async (req, res) => {
    const {email} = req.body;
    let existingUser = await Student.findOne({ email });
    try {
        if (!existingUser) {
            const newUser = new Student({ email });
            await newUser.save();
            res.send({ message: errorMessages.userCreated, user: newUser });
        } else {
            res.send({ message: errorMessages.userAlreadyExists, user: existingUser});
        }
    } catch (error) {
        res.status(500).json({ message: errorMessages.internalServerError });
    }
});

studentRouter.get('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    
    try {
        const studentDetails = await Student.findById(studentId);

        if (!studentDetails) {
            return res.status(404).json({ message: errorMessages.studentNotFound });
        }

        res.json(studentDetails);
    } catch (err) {
        res.status(500).json({ message: errorMessages.internalServerError });
    }
});

studentRouter.put('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    const studentData = req.body;
    
    try {
        const updatedStudent = await Student.findByIdAndUpdate(studentId,studentData,{new:true});
        res.json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: errorMessages.internalServerError });
    }
    
});

studentRouter.delete('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    
    try {
        const deletedStudent = await Student.findByIdAndDelete(studentId);
        res.json(deletedStudent);
    } catch (error) {
        res.status(500).json({ message: errorMessages.internalServerError });
    }
});

export default studentRouter;