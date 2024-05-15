import "./add-draft.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAddDraftMutation } from "../draftsApiSlice";
import { useGetAllClassesQuery } from "../../../classes/classesApiSlice";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';
const AddDraft = () => {
    const [addDraft, { data, isError, error, isSuccess, isLoading }] = useAddDraftMutation()
    const { data: classesObject, isLoading: isClassesLoading } = useGetAllClassesQuery()
    const [InputsArray, setInputsArray] = useState([""])
    const [firstChange, setFirstChange] = useState(false)

    const [selectedDate, setSelectedDate] = useState(null);
    const navigate = useNavigate()
    useEffect(() => {
        if (isSuccess) {
            navigate("/dash/dictations/drafts")
        }

    }, [isSuccess])
    const addNewWordInput = (index) => {
        if (index === InputsArray.length - 1) {
            setInputsArray([...InputsArray, ""])
        }

    }
    const handleDateChange = (date) => {
        setSelectedDate(date);

    };
    const formSubmit = (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        const draftObject = Object.fromEntries(data.entries())
        const dictationWords = [];
        for (let i = 0; i < data.getAll('word').length; i++) {
            const word = data.getAll('word')[i];
            const meanings = data.getAll('meaning')[i].split(", ");
            if (word != "" || meanings != "") {
                dictationWords.push({ word, meanings });
            }
        }
        draftObject.dictationWords = dictationWords;
        addDraft(draftObject)





    }
    if (isClassesLoading) return <h1> Loading ...</h1>
    return (
        <div className="add-draft-container">
            <form onSubmit={formSubmit} className="add-draft-form">
                <input
                    type="text"
                    name="name"
                    placeholder="הכנס שם הכתבה"
                    required
                />

                <select name="classId" id="classId" required>
                    <option> בחר כיתה</option>
                    {classesObject.data?.map(oneClass => {
                        return <option value={oneClass._id}>{oneClass.school + " " + oneClass.grade + " " + oneClass.gradeNumber + " " + oneClass.schoolYear}</option>
                    })}
                </select>
                <input 
                type="date" 
                 name="endDate"
               placeholder="בחר תאריך הגשה"
              
                />
                {InputsArray?.map((item, index) => (
                    <span>
                        <input
                            type="text"
                            name="word"
                            placeholder="הכנס מילה חדשה"
                            onChange={() => addNewWordInput(index)}
                        />


                        <input
                            type="text"
                            name="meaning"
                            placeholder="הכנס פרוש"

                        />
                    </span>

                ))}




                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default AddDraft