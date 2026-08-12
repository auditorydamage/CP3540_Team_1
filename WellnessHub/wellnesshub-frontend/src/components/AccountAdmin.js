import { useState, useEffect } from "react";

function AccountAdmin() {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({_id: "", username: "", email: "", role: ""});
    const [editVisible, setEditVisible] = useState(false);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const data = await fetch(`http://localhost:3000/api/accounts/list`);
                const fetchedUsers = await data.json();
                setUsers(fetchedUsers.users);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
        fetchUsers();
    }, []);

    async function handleEdit (userId) {
        const selectedAccount = await fetch(`http://localhost:3000/api/accounts/${userId}`);
        const accountData = await selectedAccount.json();
        setUser(accountData);
        console.log(`Editing user with ID: ${userId}`);
        setEditVisible(true);
    }

    async function handleSubmit (e) {
        e.preventDefault();
        const updatedAccount = await fetch(`http://localhost:3000/api/accounts/${user._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });
        const accountData = await updatedAccount.json();
        setUser(accountData);
        console.log(`Submit user: ${JSON.stringify(user)}`);
        setEditVisible(false);
    }

    async function handleActivate (userId) {
        const activatedAccount = await fetch('http://localhost:3000/api/accounts/activate/${userId}', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
        const accountData = await activatedAccount.json();
        setUser(accountData);
        console.log(`Activated user with ID: ${userId}`);
    }

    async function handleDelete (userId) {
        const deletedAccount = await fetch(`http://localhost:3000/api/accounts/delete?account=${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        

        console.log(`Deleted user with ID: ${userId}`);
    }

    return (
        <>
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
                        return (
                            <>
                                <tr key={user._id}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td><button onClick={handleEdit}>Edit</button></td>
                                    { user.isActive ? <td><button onClick={handleActivate}>Deactivate</button></td> : <td><button onClick={handleActivate}>Activate</button></td> }
                                    <td><button onClick={handleDelete}>Delete</button></td>
                                </tr>
                            </>
                        )
                    })}
                </tbody>
            </table>
            { !editVisible ? null : (
            <>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={user.username}
                        onChange={(e) => setUser({...user, username: e.target.value})}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={user.email}
                        onChange={(e) => setUser({...user, email: e.target.value})}
                    />
                    <select
                        type="text"
                        value={user.role}
                        onChange={(e) => setUser({...user, role: e.target.value})}
                    />
                        <option value="user">User</option>
                        <option value="provider">Provider</option>
                        <option value="admin">Admin</option>
                    <button type="submit">Submit</button>
                </form>
            </>
            )}
        </>
    )
}

export {AccountAdmin};