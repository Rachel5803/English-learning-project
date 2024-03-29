const Class = require("../models/Class")
const getClasses = async (req, res) => {
    const classes = await Class.find({}).lean()
    if (!classes.length) {
        return res.status(400).json({
            error: true,
            massage: 'No classes found',
            data: null
        })
    }
    res.json({
        error: false,
        message: '',
        data: classes
    })
}
const getActiveClasses = async (req, res) => {
    const classes = await Class.find({active:true}).lean()
    if (!classes.length) {
        return res.status(400).json({
            error: true,
            massage: 'No  active classes found',
            data: null
        })
    }
    res.json({
        error: false,
        message: '',
        data: classes
    })
}
// const getClassById = async (req, res) => {
//     const { id } = req.params
//     const foundClass = await Class.findById(id).lean()
//     if (!foundClass) {
//         return res.status(400).json({ massage: 'No class found' })
//     }
//     res.json(foundClass)

// }
const createNewClass = async (req, res) => {
    const { school, grade, gradeNumber, active } = req.body
    if (!school||!grade || !gradeNumber) {
        return res.status(400).json({
            error: true,
            massage: 'You need to press school, grade and grade number',
            data: null
        })
    }
    const checkDouble = await Class.findOne({ school: school, grade: grade, gradeNumber: gradeNumber, active: true }).lean()
    if (checkDouble.length != 0) {
        return res.status(400).json({
            error: true,
            massage: 'The class exists in the system',
            data: null
        })

    }
    const classCreate = await Class.create({ school, grade, gradeNumber, active })
    if (classCreate) {
        return res.json({
            error: false,
            message: '',
            data: classCreate
        })
    }
    else {
        return res.status(400).json({
            error: true,
            massage: 'Something worng',
            data: null
        })
    }
}
const updateClass = async (req, res) => {
    const { id, school, grade, gradeNumber, active } = req.body
    if (!id || !school || !grade || !gradeNumber) {
        return res.status(400).json({
            error: true,
            massage: 'Id, school, grade and grade number are required',
            data: null
        })
    }
    const foundClass = await Class.findById( id ).exec()
    if (!foundClass) {
        return res.status(400).json({
            error: true,
            massage: 'No class found',
            data: null
        })
    }
    foundClass.school = school
    foundClass.grade = grade
    foundClass.gradeNumber = gradeNumber
    foundClass.active = active
    const updateClass = await foundClass.save();
    res.json({
        error: false,
        massage: `'${updateClass.name}' updated`,
        data: updateClass
    })
}
const deleteClass = async (req, res) => {
    const { id } = req.body
    if (!id) {
        return res.status(400).json({
            error: true,
            massage: 'Id is required',
            data: null
        })
    }
    const foundClass = await Class.findById(id).exec()
    if (!foundClass) {
        return res.status(400).json({
            error: true,
            massage: 'No class found',
            data: null
        })
    }
    const result = await foundClass.deleteOne()
    res.json({
        error: false,
        massage: '',
        data: result
    })
}
module.exports = { getClasses,getActiveClasses, createNewClass, updateClass, deleteClass }
