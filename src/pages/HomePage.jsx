import axios from 'axios';
import React, { useState, useEffect } from 'react'

const HomePage = () => {
     // State variables
    const [isTableExpanded, setIsTableExpanded] = useState(false);
    const [userData, setUserData] = useState([]);
    const [inputId, setInputId] = useState('');
    const [userDetails, setUserDetails] = useState({name:'', email:''});
    const [newUserData, setNewUserData] = useState({name:'---Name---', email:'---@---'});
    const [errorMessage, setErrorMessage] = useState('');

    // Function to fetch data from API
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/1/users');
            setUserData(response.data.data); // Update state with response data
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage('Error fetching data: ' + error.message);

        }
    };

    // Function to handle posting data to the server
    const handlePostData = async () => {
        console.log(newUserData);
    try {
        await axios.post('http://localhost:3001/api/1/users', newUserData);
        // Optionally, you can reset the newUserData state after successful posting
        setNewUserData([{ name: '---Name---', email: '---@---' }]);
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
        const newData = [...userData];
        newData[rowIndex][columnIndex] = prompt('Enter new value:');
        setUserData(newData);
    };

    const handleNewUserCellDoubleClick = (index) => {
        const updateUserData = {...newUserData};
        updateUserData[index] = prompt('Enter new value:');
        console.log(updateUserData)
        setNewUserData(updateUserData);
        console.log(newUserData)
    };

    // Function to handle delete button click and delete information from the same column for the corresponding user
    const handleDeleteButtonClick = async (id) => {
        try {
            const newData = [...userData];
            const userIndex = userData.findIndex(user => user.id === id);
            if (userIndex !== -1) {
                newData.splice( userIndex, 1 );
                setUserData(newData);
                await axios.delete(`http://localhost:3001/api/1/users/${id}`);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            setErrorMessage('Error fetching data: ' + error.message);

        }
    };

    // Function to fetch data from API
    const fetchOneData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/1/users/${inputId}`);
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
            <h1>Get Users, Delete User with Id</h1>
            <button onClick={handleButtonClick}>Fetch Data</button>
            {isTableExpanded && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Commands</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map(( user, rowIndex) => (
                            <tr key={user.id}>
                                <td onDoubleClick={() => handleCellDoubleClick(rowIndex, 'name')} >{user.name}</td>
                                <td onDoubleClick={() => handleCellDoubleClick(rowIndex, 'email')}>{user.email}</td>
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
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{userDetails.name}</td>
                        <td>{userDetails.email}</td>
                    </tr>
                </tbody>
            </table>
            <h1>Post User</h1>
            <button onClick={handlePostData}>Post Data</button>
            <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                            <tr>
                                <td onDoubleClick={() => handleNewUserCellDoubleClick('name')} >{newUserData.name}</td>
                                <td onDoubleClick={() => handleNewUserCellDoubleClick('email')}>{newUserData.email}</td>
                            </tr>
                    </tbody>
                </table>
        </div>
    );
}

export default HomePage;