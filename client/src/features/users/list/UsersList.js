import "./users-list.css"
import { Link, useSearchParams } from 'react-router-dom';
import Search from "../../../components/search/Search";
import { useGetAllUsersQuery, useDeleteUserMutation } from '../usersApiSlice';
import { useGetAllClassesQuery } from "../../classes/classesApiSlice";
import { useState } from "react"
import useGetFilePath from "../../../hooks/useGetFilePath"
import moment from 'moment';
const UsersList = () => {
  const [detailsClass, setDetailsClass] = useState({})
  const { data: usersObject, isError, error, isLoading, isSuccess } = useGetAllUsersQuery()
  const [deleteUser, { isSuccess: isDeleteSuccess }] = useDeleteUserMutation()
  //const { data: classesObject, isLoading: isClassesLoading } = useGetAllClassesQuery()
  const [searchParams] = useSearchParams()
   const q = searchParams.get("q")
   const {getFilePath} = useGetFilePath()
  const deleteClick = (user) => {
    if (window.confirm("בטוח שברצונך למחוק את המשתמש?")) {
      deleteUser({ _id: user._id })
    }

  }
  if (isLoading ) return <div className="error-page"> טוען נתונים</div>
  if (isError) return <div className="error-users-list">
    <div className="error-page">{error.data.massage}</div> 
    <Link className="users-list-add-button" to="/dash/users/add">משתמש חדש</Link>
  </div>
  const filteredData = !q? [...usersObject.data] : usersObject.data.filter(user=> (user.class.school?.indexOf(q) > -1) || (user.name.indexOf(q) > -1))


  return (
    <div className="users-list">
    
      <div className="users-list-top">
        <Search placeholder="Search for a user..." />
        <Link className="users-list-add-button" to="/dash/users/add">משתמש חדש</Link>


      </div>
      <table className="users-list-table">
        <thead>
          <tr>
            <td>שם</td>
            <td>שם משתמש</td>
            <td>בית ספר</td>
            <td>כיתה</td>
            <td>מספר כיתה</td>
            <td>נוצר ב</td>
            <td>הרשאה</td>
            <td>פעיל</td>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((user) => (
            <tr key={user.id}>
              <div className="users-list-user">
                <img
                  src={ getFilePath(user.image)}
                  alt=""
                  width={40}
                  height={40}
                  className="users-list-user-image" />
                {user.name}
              </div>
              <td>{user.username}</td>
              
              <td>{user.class?.school}</td>
              <td>{user.class?.grade}</td>
              <td>{user.class?.gradeNumber}</td>
              <td>{moment(user.createdAt).format('DD/MM/YYYY')}</td>
              <td>{user.roles === "Teacher" ? "מורה" : "תלמידה"}</td>
              <td>{user.active ? "כן" : "לא"}</td>
              <td>
                <div className="users-list-buttons">
                  <Link className='users-list-button users-list-view' to={`/dash/users/${user._id}`}>
                   צפייה בפרטי משתמש
                  </Link>
                  <Link className='users-list-button users-list-view' to={`/dash/users/grades/${user._id}`}>
                   צפייה בציונים
                  </Link>

                  <button onClick={() => deleteClick(user)} className="users-list-button users-list-delete">
                    מחיקה
                  </button>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default UsersList