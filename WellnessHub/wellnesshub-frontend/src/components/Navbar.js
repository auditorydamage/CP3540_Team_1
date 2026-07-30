function Navbar() {
    return (
        <div
            style={{
                height: "70px",
                backgroundColor: "#ffffff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 30px",
                borderBottom: "1px solid #ddd",
                boxSizing: "border-box"
            }}
        >
            <h2>Dashboard</h2>

            <div>
                <strong>User</strong>
            </div>
        </div>
    );
}

export default Navbar;