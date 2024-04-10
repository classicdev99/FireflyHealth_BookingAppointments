import { CalendarToday, ControlPoint } from '@mui/icons-material';
import { Box, Link } from '@mui/material';
import { useLocation } from 'react-router-dom';

const sidebarLinks = [
    {
        label: 'Appointments',
        icon: CalendarToday,
        href: '/appointments',
    },
    {
        label: 'Book Appointments',
        icon: ControlPoint,
        href: '/appointments/new',
    }
]

const Sidebar = () => {
    const location = useLocation();

    return (
        <Box
            display="flex"
            flexDirection="column"
            p={2}
        >
            {sidebarLinks.map((link, index) => (
                <Link
                    key={index}
                    href={link.href}
                    underline='always'
                    color={location.pathname === link.href ? 'primary' : 'inherit'}
                    sx={{
                        opacity: location.pathname === link.href ? 1 : 0.7,
                    }}
                    display={'flex'} alignItems={'center'} p={1}
                >
                    <link.icon />
                    <span style={{ marginLeft: '8px' }}>{link.label}</span>
                </Link>
            ))}

        </Box>
    )
}


export default Sidebar;