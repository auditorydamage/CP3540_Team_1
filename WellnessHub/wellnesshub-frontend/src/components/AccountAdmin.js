import { useState, useEffect } from "react";
import { apiRequest } from "../services/api.js";

function AccountAdmin() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({_id: "", username: "", emailAddress: "", accountType: "user"});
    const [entryVisible, setEntryVisible] = useState(false);
    const [filter, setFilter] = useState("all");
    const [textFilter, setTextFilter] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const data = await apiRequest(`/accounts/list`);
            console.log(data);
            const fetchedUsers = data.accounts;
            setUsers(fetchedUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    async function handleEdit (e) {
        e.preventDefault();
        const userId = e.target.parentNode.parentNode.id;
        const selectedAccount = await apiRequest(`/accounts/${userId}`);
        const accountData = selectedAccount.account;
        setUser({...accountData});
        setEntryVisible(true);
        console.log(`Editing user with ID: ${userId}`);
    }

    async function handleSubmit (e) {
        e.preventDefault();
        try {
            if (!user._id) {
                await apiRequest(`/accounts/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({...user})
                });
            } else {
                await apiRequest(`/accounts/${user._id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({...user})
                });
            }
        setUser({_id: "", username: "", emailAddress: "", password: "", accountType: "user"});
        } catch (error) {
            console.log("Unable to submit user info: ", error.message);
            alert(`Unable to submit user information: ${error.message}`);
        }
        setEntryVisible(false);
        fetchUsers();
    }

    async function handleActivate (e) {
        e.preventDefault();
        const userId = e.target.parentNode.parentNode.id;
        const activatedAccount = await apiRequest(`/accounts/${userId}`);
        console.log(activatedAccount);
        if (!activatedAccount.account.isActive) {
            activatedAccount.account.isActive = true;
            await apiRequest(`/accounts/activate/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(activatedAccount.account)
            });
            alert(`Account ${activatedAccount.account.username} activated.`);
        } else {
            activatedAccount.account.isActive = false;
            await apiRequest(`/accounts/activate/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(activatedAccount.account)
            });
            alert(`Account ${activatedAccount.account.username} deactivated.`);
        }
        fetchUsers();
    }

    async function handleDelete (e) {
        e.preventDefault();
        const userId = e.target.parentNode.parentNode.id;
        console.log(userId);
        const deletedAccount = await apiRequest(`/accounts/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log(deletedAccount);
        fetchUsers();
    }

    function handleClear (e) {
        e.preventDefault();
        setUser({_id: "", username: "", emailAddress: "", password: "", accountType: "user"});
    }

    function toggleEntry (e) {
        e.preventDefault();
        setEntryVisible(!entryVisible);
    }

    function handleFilter(e) {
        e.preventDefault();
        setFilter(e.target.value);
    }

    function handleTextFilter (e) {
        e.preventDefault();
        setTextFilter(e.target.value);
    }

    return (
        <>
            <table>
                <tbody>
                    <tr>
                        <td>Filter by: </td>
                        <td><select value={filter} onChange={handleFilter}>
                            <option value="all">All</option>
                            <option value="user">User</option>
                            <option value="provider">Provider</option>
                            <option value="admin">Administrator</option>
                        </select></td>
                    </tr>
                    <tr>
                        <td>Search pattern: </td>
                        <td><input value={textFilter} onChange={handleTextFilter}></input></td>
                    </tr>
                </tbody>
            </table>
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    { !users ? null : users.map((user) => {
                        if ((user.accountType === filter || filter === "all") && user.username.includes(textFilter) ) {
                            return (
                                <>
                                    <tr id={user._id} key={user._id}>
                                        <td>{user.username}</td>
                                        <td>{user.emailAddress}</td>
                                        <td>{user.accountType}</td>
                                        <td><button onClick={handleEdit}>Edit</button></td>
                                        { user.isActive ? <td><button onClick={handleActivate}>Deactivate</button></td> : <td><button onClick={handleActivate}>Activate</button></td> }
                                        <td><button onClick={handleDelete}>Delete</button></td>
                                    </tr>
                                </>
                            )
                        }
                        return (<></>);
                    })}
                </tbody>
            </table>
            { !user._id ? 
                <h3 style={{ cursor: "pointer" }} onClick={toggleEntry}>{ !entryVisible ? <>▶</> : <>▼</> }     Create new user</h3> : 
                <h3 style={{ cursor: "pointer" }} onClick={toggleEntry}>{ !entryVisible ? <>▶</> : <>▼</> }     Edit user</h3>
            }
            { !entryVisible ? null : 
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td>Username: </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={user.username}
                                        onChange={(e) => setUser({...user, username: e.target.value})}
                                    />
                                </td>
                            </tr>
                            { !user._id ? 
                            <tr>
                                <td>Password: </td>
                                <td>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={user.password}
                                        onChange={(e) => setUser({...user, password: e.target.value})}
                                    />
                                </td>
                            </tr>
                            : null }
                            <tr>
                                <td>E-mail address: </td>
                                <td>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={user.emailAddress}
                                        onChange={(e) => setUser({...user, emailAddress: e.target.value})}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Account type: </td>
                                <td>
                                    <select
                                        value={user.accountType}
                                        onChange={(e) => setUser({...user, accountType: e.target.value})}
                                    >
                                        <option value="user">User</option>
                                        <option value="provider">Provider</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td><button type="submit">Submit</button> <button onClick={handleClear}>Reset</button></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            } 
        </>
    )
}

export {AccountAdmin};