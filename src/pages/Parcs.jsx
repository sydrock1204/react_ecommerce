import axios from 'axios';
import React, { useState, useEffect } from 'react'

const Parcs = () => {
     // State variables
    const [isTableExpanded, setIsTableExpanded] = useState(false);
    const [parcData, setparcData] = useState([]);
    const [inputId, setInputId] = useState('');
    const [userDetails, setUserDetails] = useState({name:'', description:''});
    const [newparcData, setNewparcData] = useState({name:'---Name---', description:'---@---'});
    const [errorMessage, setErrorMessage] = useState('');

    // Function to fetch data from API
    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/1/parcs');
            setparcData(response.data.data); // Update state with response data
        } catch (error) {
            console.error('Error fetching data:', error);
            setErrorMessage('Error fetching data: ' + error.message);

        }
    };

    // Function to handle posting data to the server
    const handlePostData = async () => {
        console.log(newparcData);
    try {
        await axios.post('http://localhost:3001/api/1/parcs', newparcData);
        // Optionally, you can reset the newparcData state after successful posting
        setNewparcData([{ name: '---Name---', description: '---@---' }]);
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
        const newData = [...parcData];
        newData[rowIndex][columnIndex] = prompt('Enter new value:');
        setparcData(newData);
    };

    const handleNewUserCellDoubleClick = (index) => {
        const updateparcData = {...newparcData};
        updateparcData[index] = prompt('Enter new value:');
        console.log(updateparcData)
        setNewparcData(updateparcData);
        console.log(newparcData)
    };

    // Function to handle delete button click and delete information from the same column for the corresponding user
    const handleDeleteButtonClick = async (id) => {
        try {
            const newData = [...parcData];
            const userIndex = parcData.findIndex(user => user.id === id);
            if (userIndex !== -1) {
                newData.splice( userIndex, 1 );
                setparcData(newData);
                await axios.delete(`http://localhost:3001/api/1/parcs/${id}`);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
            setErrorMessage('Error fetching data: ' + error.message);

        }
    };

    // Function to fetch data from API
    const fetchOneData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/1/parcs/${inputId}`);
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
            <h1>Get Parcs, Delete Parcs with Id</h1>
            <button onClick={handleButtonClick}>Fetch Data</button>
            {isTableExpanded && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Commands</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcData.map(( user, rowIndex) => (
                            <tr key={user.id}>
                                <td onDoubleClick={() => handleCellDoubleClick(rowIndex, 'name')} >{user.name}</td>
                                <td onDoubleClick={() => handleCellDoubleClick(rowIndex, 'description')}>{user.description}</td>
                                <td>
                                    <button onClick={() => handleDeleteButtonClick(user.id)}>Delete</button>
                                </td>
                            </tr>
                        ))} 
                    </tbody>
                </table>
            )}
            <h1>Get Parcs with Id</h1>
             <form onSubmit={handleSubmit}>
                <label>
                    Enter Parcs ID:
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
                        <td>{userDetails.description}</td>
                    </tr>
                </tbody>
            </table>
            <h1>Post Parc</h1>
            <button onClick={handlePostData}>Post Data</button>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                        <tr>
                            <td onDoubleClick={() => handleNewUserCellDoubleClick('name')} >{newparcData.name}</td>
                            <td onDoubleClick={() => handleNewUserCellDoubleClick('description')}>{newparcData.description}</td>
                        </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Parcs;