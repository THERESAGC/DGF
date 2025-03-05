import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    IconButton,
    Typography,
    Box,
    Pagination,
  } from "@mui/material";
  import { ArrowForward } from "@mui/icons-material"; // Import ArrowForward icon
  import { styled } from "@mui/material/styles";
 
  const ArrowForwardDesign = styled(IconButton)(({ theme }) => ({
    width: "22px",
    height: "22px",
    border: "2px solid #000000",
    borderRadius: "50%",
    marginRight: "10px",
    marginLeft: "8px",
    backgroundColor: "rgba(255, 255, 255, 0)",
    "&:hover": {
      backgroundColor: "#d1d1d1",
    },
    "& svg": {
      fontSize: "16px",
      fontWeight: "bold",
    },
  }));
 
  const users = [
    {
      id: "HS118",
      name: "Mike Clark",
      email: "mike@xyzorg.com",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tmp_65da34e4-76e1-4fdd-bff0-c912af641938-rsnueTWgNqOmJYBKk62PPt0Ju0Z0o8.png",
      role: "Capdev",
      createdOn: "Jan 20, 2025",
      status: "Active",
    },
    {
      id: "HS119",
      name: "Alan Patel",
      email: "alan@xyzorg.com",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tmp_65da34e4-76e1-4fdd-bff0-c912af641938-rsnueTWgNqOmJYBKk62PPt0Ju0Z0o8.png",
      role: "Capdev",
      createdOn: "Jan 20, 2025",
      status: "Active",
    },
    {
      id: "HS542",
      name: "Joe Estrada",
      email: "joe@xyzorg.com",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tmp_65da34e4-76e1-4fdd-bff0-c912af641938-rsnueTWgNqOmJYBKk62PPt0Ju0Z0o8.png",
      role: "SPOC",
      createdOn: "Jan 15, 2025",
      status: "Active",
    },
    {
      id: "HS1542",
      name: "Janet Powell",
      email: "janet@xyzorg.com",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tmp_65da34e4-76e1-4fdd-bff0-c912af641938-rsnueTWgNqOmJYBKk62PPt0Ju0Z0o8.png",
      role: "SPOC",
      createdOn: "Jan 12, 2025",
      status: "Active",
    },
    {
      id: "HS222",
      name: "Joel Jones",
      email: "joel@xyzorg.com",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tmp_65da34e4-76e1-4fdd-bff0-c912af641938-rsnueTWgNqOmJYBKk62PPt0Ju0Z0o8.png",
      role: "SPOC",
      createdOn: "Jan 10, 2025",
      status: "Inactive",
    },
  ];
 
  export default function UserTable() {
    return (
      <Box sx={{  backgroundColor: "#FFFFFF", borderRadius: "15px", opacity: 1, padding: 3, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", transition: "min-height 0.3s ease" }}>
        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ borderBottom: "2px solid #8FBEF8"}}>
                <TableCell sx={{ fontFamily: "inherit", fontWeight: "bold"}}>User ID</TableCell>
                <TableCell sx={{ fontFamily: "inherit", fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontFamily: "inherit", fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontFamily: "inherit", fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ fontFamily: "inherit", fontWeight: "bold" }}>Created on</TableCell>
                <TableCell sx={{ fontFamily: "inherit", fontWeight: "bold" }}>Status</TableCell>
                <TableCell sx={{ fontFamily: "inherit", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id} sx={{ backgroundColor: index % 2 === 0 ? "#F1F2FD" : "white" }}>
                  <TableCell sx={{ fontFamily: "inherit" }}>{user.id}</TableCell>
                  <TableCell sx={{ fontFamily: "inherit" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Avatar src={user.avatar} sx={{ width: 24, height: 24 }} />
                      <Typography>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontFamily: "inherit" }}>{user.email}</TableCell>
                  <TableCell sx={{ fontFamily: "inherit" }}>{user.role}</TableCell>
                  <TableCell sx={{ fontFamily: "inherit" }}>{user.createdOn}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        color: user.status === "Active" ? "#2BB381" : "#AA1700",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        fontFamily: "inherit",
                      }}
                    >
                      {user.status}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontFamily: "inherit" }}>
                    <ArrowForwardDesign>
                    <IconButton size="small">
                      <ArrowForward />
                     
                    </IconButton>
                    </ArrowForwardDesign>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "inherit" }}>
            Showing 5 of 15 records
          </Typography>
          <Pagination count={3} size="small" shape="rounded" />
        </Box>
      </Box>
    );
  }