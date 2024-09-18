import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import to get the userId from the URL
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import dayjs from 'dayjs'; // For date calculations

// project import
import Dot from 'components/@extended/Dot';
import { findAllDemandsByUser } from 'src/service/congeDemandeService'; // Import the service to fetch demands

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    {
        id: 'motif',
        align: 'left',
        disablePadding: false,
        label: 'Motif'
    },
    {
        id: 'etat',
        align: 'left',
        disablePadding: true,
        label: 'Status'
    },
    {
        id: 'daysRequested',
        align: 'right',
        disablePadding: false,
        label: 'Days Requested'
    },
    {
        id: 'dateDebut',
        align: 'left',
        disablePadding: false,
        label: 'Start Date'
    }
];

// ==============================|| DEMANDS TABLE - HEADER ||============================== //

function DemandsTableHead({ order, orderBy }) {
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// ==============================|| DEMAND STATUS ||============================== //

function DemandStatus({ status }) {
    let color;
    let title;

    switch (status) {
        case 'APPROUVE':
            color = 'success';
            title = 'approved';
            break;
        case 'REFUSE':
            color = 'error';
            title = 'refused';
            break;
        case 'EN_ATTENTE':
            color = 'warning';
            title = 'pending';
            break;
        default:
            color = 'primary';
            title = 'unknown';
    }

    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Dot color={color} />
            <Typography style={{ textTransform: 'lowercase' }}>{title}</Typography> {/* Lowercase text */}
        </Stack>
    );
}

// ==============================|| DEMANDS TABLE ||============================== //

export default function DemandsTable() {
    const { userId } = useParams(); // Get userId from the URL
    const [demands, setDemands] = useState([]); // State to store the demands
    const order = 'asc';
    const orderBy = 'motif';

    useEffect(() => {
        // Fetch demands when the component is mounted
        const fetchDemands = async () => {
            try {
                const response = await findAllDemandsByUser(userId); // Fetch demands by userId
                console.log('API Response:', response); // Log the response to check the data
                console.log('User ID from URL:', userId); // Log to verify userId

                setDemands(response); // Store the demands in the state
            } catch (error) {
                console.error('Error fetching demands:', error);
            }
        };

        fetchDemands();
    }, [userId]); // Re-run the effect when userId changes

    const calculateDaysRequested = (startDate, endDate) => {
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        return end.diff(start, 'day'); // Calculate difference in days
    };

    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table aria-labelledby="tableTitle">
                    <DemandsTableHead order={order} orderBy={orderBy} />
                    <TableBody>
                        {stableSort(demands, getComparator(order, orderBy)).map((row, index) => {
                            const labelId = `enhanced-table-checkbox-${index}`;

                            return (
                                <TableRow
                                    hover
                                    role="checkbox"
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    tabIndex={-1}
                                    key={row.id} // Assuming demand's ID is 'id'
                                >
                                    <TableCell component="th" id={labelId} scope="row">
                                        <Link color="secondary"> {row.motif}</Link> {/* Motif */}
                                    </TableCell>
                                    <TableCell>
                                        <DemandStatus status={row.etat} /> {/* Etat (Status) */}
                                    </TableCell>
                                    <TableCell align="right">
                                        {calculateDaysRequested(row.dateDebut, row.dateFin)} {/* Days Requested */}
                                    </TableCell>
                                    <TableCell>{dayjs(row.dateDebut).format('YYYY-MM-DD')}</TableCell> {/* Start Date */}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

DemandsTableHead.propTypes = { order: PropTypes.any, orderBy: PropTypes.string };

DemandStatus.propTypes = { status: PropTypes.string };
