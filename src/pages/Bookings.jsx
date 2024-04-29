import axios from 'axios';
import React, { useState, useEffect } from 'react'

const Bookings = () => {
     // State variables
    const [isTableExpanded, setIsTableExpanded] = useState(false);
    const [bookData, setbookData] = useState([]);
    const [inputId, setInputId] = useState('');
    const [userDetails, setUserDetails] = useState({user:'', parc:'', bookingdate:'', comments:''});
    const [newbookData, setNewbookData] = useState({user:'---user---', parc:'---parc---', bookingdate:'---date---', comments:'---comments----'});
    const [errorMessage, setErrorMessage] = useState('');

    // Function to fetch data from API
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/1/bookings');
            setbookData(response.data.data); // Update state with response data
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage('Error fetching data: ' + error.message);

        }
    };

    // Function to handle posting data to the server
    const handlePostData = async () => {
        console.log(newbookData);
    try {
        await axios.post('http://localhost:3001/api/1/bookings', newbookData);
        // Optionally, you can reset the newbookData state after successful posting
        setNewbookData([{user:'---', parc:'---', bookingdate:'', comments:'----'}]);
        console.log('Data posted successfully');
    } catch (error) {
        console.error('Error posting data:', error.response);
        setErrorMessage('Error fetching data: ' + error.message);

    }
};
    // Fetch data when component mounts
    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array ensures that this effect runs only once

    const handleButtonClick = () => {
        setIsTableExpanded(!isTableExpanded);
    };

     // Function to handle cell double-click and enable editing
     const handleCellDoubleClick = (rowIndex, columnIndex) => {
        const newData = [...bookData];
        newData[rowIndex][columnIndex] = prompt('Enter new value:');
        setbookData(newData);
    };

    const handleNewUserCellDoubleClick = (index) => {
        const updatebookData = {...newbookData};
        updatebookData[index] = prompt('Enter new value:');
        console.log(updatebookData)
        setNewbookData(updatebookData);
        console.log(newbookData)
    };

    // Function to handle delete button click and delete information from the same column for the corresponding user
    const handleDeleteButtonClick = async (id) => {
        try {
            const newData = [...bookData];
            const userIndex = bookData.findIndex(user => user.id === id);
            if (userIndex !== -1) {
                newData.splice( userIndex, 1 );
                setbookData(newData);
                await axios.delete(`http://localhost:3001/api/1/bookings/${id}`);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            setErrorMessage('Error fetching data: ' + error.message);

        }
    };

    // Function to fetch data from API
    const fetchOneData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/1/bookings/${inputId}`);
            setUserDetails(response.data); // Update state with response data
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
            setErrorMessage('Error fetching data: ' + error.message);

        }
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputId !== '') {
            fetchOneData();
        }
    };

    return (
        <div>
            {errorMessage && <div className="error-message" style={{color:'red'}}><h1>{errorMessage}</h1></div>}
            <h1>Get Bookings, Delete Booking with Id</h1>
            <button onClick={handleButtonClick}>Fetch Data</button>
            {isTableExpanded && (
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Parc</th>
                            <th>Booking Date</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookData.map(( user, rowIndex) => (
                            <tr key={user.id}>
                                <td onDoubleClick={() => handleCellDoubleClick(rowIndex, 'user')} >{user.user}</td>
                                <td onDoubleClick={() => handleCellDoubleClick(rowIndex, 'parc')}>{user.parc}</td>
                                <td onDoubleClick={() => handleCellDoubleClick(rowIndex, 'bookingdate')}>{user.bookingdate}</td>
                                <td onDoubleClick={() => handleCellDoubleClick(rowIndex, 'comments')}>{user.comments}</td>
                                <td>
                                    <button onClick={() => handleDeleteButtonClick(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <h1>Get User with Id</h1>
             <form onSubmit={handleSubmit}>
                <label>
                    Enter User ID:
                    <input type="text" value={inputId} onChange={(e) => setInputId(e.target.value)} />
                </label>
                <button type="submit">Submit</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Parc</th>
                        <th>Booking Date</th>
                        <th>Comment</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{userDetails.user}</td>
                        <td>{userDetails.parc}</td>
                        <td>{userDetails.bookingdate}</td>
                        <td>{userDetails.comments}</td>
                    </tr>
                </tbody>
            </table>
            <h1>Post User</h1>
            <button onClick={handlePostData}>Post Data</button>
            <table>
                    <thead>
                        <tr>
                            <th>user</th>
                            <th>parc</th>
                            <th>bookingdate</th>
                            <th>comments</th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr>
                                <td onDoubleClick={() => handleNewUserCellDoubleClick('user')} >{newbookData.user}</td>
                                <td onDoubleClick={() => handleNewUserCellDoubleClick('parc')}>{newbookData.parc}</td>
                                <td onDoubleClick={() => handleNewUserCellDoubleClick('bookingdate')}>{newbookData.bookingdate}</td>
                                <td onDoubleClick={() => handleNewUserCellDoubleClick('comments')}>{newbookData.comments}</td>
                            </tr>
                    </tbody>
                </table>
        </div>
    );
}

export default Bookings;