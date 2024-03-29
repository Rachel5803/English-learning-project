const express = require("express")
const router = express.Router()
const dictationFUController = require("../controller/dictationFUController")
router.get("/user", dictationFUController.getDictationsForSpecificUser)
router.get("/", dictationFUController.getDictationsFromAllUsersInClass)
router.get("/:id", dictationFUController.getDictationFUById)
router.post("/", dictationFUController.createNewDictationsForUsers)
router.put("/", dictationFUController.updateDictationForUserDetails)



module.exports = router