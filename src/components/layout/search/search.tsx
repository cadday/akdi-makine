import { useEffect, useState } from "react";

import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";

import { cn } from "@/lib/utils";
import {
  Briefcase,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Code,
  Ellipsis,
  FolderTree,
  GalleryVerticalEnd,
  Gamepad2,
  Image,
  Plus,
  SearchIcon,
  SlashSquare,
  SquareX,
  Users,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Search() {
  const isMac = navigator.userAgent.includes("Mac");

  const [tooltipShow, setTooltipShow] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClickOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        handleClickOpenDialog();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const [tabValue] = useState("all");
  const { t } = useTranslation();

  return (
    <>
      <Tooltip title={`${t("search")} (${isMac ? "cmd" : "ctrl"}+k)`} placement='bottom' open={!open && tooltipShow}>
        <Button
          variant='text'
          size='large'
          color='text-primary'
          className={cn("icon-only [&.active]:text-primary! hover:bg-grey-75", open && "active bg-grey-75 text-primary!")}
          onClick={handleClickOpenDialog}
          onMouseEnter={() => setTooltipShow(true)}
          onMouseLeave={() => setTooltipShow(false)}
          startIcon={
            <Box className='w-6 h-6 flex items-center justify-center '>
              <SearchIcon />
            </Box>
          }
        />
      </Tooltip>

      <Dialog onClose={handleCloseDialog} open={open} maxWidth='md' fullWidth classes={{ container: "items-start", paper: "mt-16" }}>
        <DialogTitle className='border-grey-100 border-b py-0!'>
          <Input
            autoFocus
            classes={{ input: "ps-0!" }}
            className='w-full py-7!'
            placeholder='Search'
            startAdornment={
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            }
          />
        </DialogTitle>
        <DialogContent className='flex flex-col pt-6 pb-0'>
          <TabContext value={tabValue}>
            <Tabs
              variant='scrollable'
              allowScrollButtonsMobile
              slots={{
                endScrollButtonIcon: () => {
                  return <ChevronRight size={16} />;
                },
                startScrollButtonIcon: () => {
                  return <ChevronLeft size={16} />;
                },
              }}
              className='flex-none'
              value={tabValue}
            >
              <Tab
                icon={<GalleryVerticalEnd className='me-0! md:me-1!' />}
                iconPosition='start'
                label={<Box className='hidden md:flex'>All</Box>}
                value='all'
              />
              <Tab icon={<Image className='me-0! md:me-1!' />} iconPosition='start' label={<Box className='hidden md:flex'>Products</Box>} value='products' />
              <Tab
                icon={<FolderTree className='me-0! md:me-1!' />}
                iconPosition='start'
                label={<Box className='hidden md:flex'>Categories</Box>}
                value='categories'
              />
              <Tab icon={<Users className='me-0! md:me-1!' />} iconPosition='start' label={<Box className='hidden md:flex'>Users</Box>} value='users' />
              <Tab
                icon={<SlashSquare className='me-0! md:me-1!' />}
                iconPosition='start'
                label={<Box className='hidden md:flex'>No Result</Box>}
                value='result'
              />
            </Tabs>
            <TabPanel value='all' className='p-0'>
              <Box className='flex flex-col gap-2.5'>
                <Box>
                  <Typography variant='body2' className='text-text-disabled mb-2 font-medium'>
                    Recent
                  </Typography>
                  <List>
                    <ListItem className='p-0'>
                      <ListItemButton classes={{ root: "group items-start" }}>
                        <ListItemAvatar>
                          <Avatar alt='Olivia Bennett' src='/images/products/product-1.jpg' className='me-3' />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography component='span' className='leading-4' variant='body1'>
                              Stretchy
                            </Typography>
                          }
                          secondary='/products/wooden-toys'
                        />
                        <Button className='pointer-events-none self-center' size='tiny' color='success' variant='pastel' startIcon={<CheckCircle size={16} />}>
                          Active
                        </Button>
                      </ListItemButton>
                    </ListItem>
                    <ListItem className='p-0'>
                      <ListItemButton classes={{ root: "group items-start" }}>
                        <ListItemAvatar>
                          <Avatar alt='Olivia Bennett' src='/images/products/product-2.jpg' className='me-3' />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography component='span' className='leading-4' variant='body1'>
                              Pony Soprano
                            </Typography>
                          }
                          secondary='/products/wooden-toys'
                        />
                        <Button className='pointer-events-none self-center' size='tiny' color='success' variant='pastel' startIcon={<CheckCircle size={16} />}>
                          Active
                        </Button>
                      </ListItemButton>
                    </ListItem>
                    <ListItem className='p-0'>
                      <ListItemButton classes={{ root: "group items-start" }}>
                        <ListItemAvatar>
                          <Avatar alt='Olivia Bennett' src='/images/products/product-3.jpg' className='me-3' />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography component='span' className='leading-4' variant='body1'>
                              Buck Rogers
                            </Typography>
                          }
                          secondary='/products/wooden-toys'
                        />
                        <Button className='pointer-events-none self-center' size='tiny' color='grey' variant='pastel' startIcon={<SquareX size={16} />}>
                          Inactive
                        </Button>
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box>
                <Box>
                  <Typography variant='body2' className='text-text-disabled mb-2 font-medium'>
                    Categories
                  </Typography>
                  <List>
                    <ListItem className='p-0'>
                      <ListItemButton classes={{ root: "group items-start" }}>
                        <ListItemAvatar>
                          <Avatar className='medium bg-primary-light/10 me-3'>
                            <Gamepad2 className='text-primary' />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography component='span' className='leading-4' variant='body1'>
                              Electronic Devices
                            </Typography>
                          }
                          secondary='314 products'
                        />
                        <Box className='flex flex-row gap-1'>
                          <Button
                            className='icon-only hover:text-text-primary hover:bg-grey-100 mt-1 flex-none opacity-0 group-hover:opacity-100'
                            size='tiny'
                            color='grey'
                            variant='text'
                            startIcon={<Plus size={16} />}
                          />
                          <Button
                            className='icon-only hover:text-text-primary hover:bg-grey-100 mt-1 flex-none opacity-0 group-hover:opacity-100'
                            size='tiny'
                            color='grey'
                            variant='text'
                            startIcon={<Ellipsis size={16} />}
                          />
                        </Box>
                      </ListItemButton>
                    </ListItem>
                    <ListItem className='p-0'>
                      <ListItemButton classes={{ root: "group items-start" }}>
                        <ListItemAvatar>
                          <Avatar className='medium bg-secondary-light/10 me-3'>
                            <Code className='text-secondary' />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography component='span' className='leading-4' variant='body1'>
                              Digital Products
                            </Typography>
                          }
                          secondary='14 products'
                        />
                        <Box className='flex flex-row gap-1'>
                          <Button
                            className='icon-only hover:text-text-primary hover:bg-grey-100 mt-1 flex-none opacity-0 group-hover:opacity-100'
                            size='tiny'
                            color='grey'
                            variant='text'
                            startIcon={<Plus size={16} />}
                          />
                          <Button
                            className='icon-only hover:text-text-primary hover:bg-grey-100 mt-1 flex-none opacity-0 group-hover:opacity-100'
                            size='tiny'
                            color='grey'
                            variant='text'
                            startIcon={<Ellipsis size={16} />}
                          />
                        </Box>
                      </ListItemButton>
                    </ListItem>
                    <ListItem className='p-0'>
                      <ListItemButton classes={{ root: "group items-start" }}>
                        <ListItemAvatar>
                          <Avatar className='medium bg-accent-1/10 me-3'>
                            <Briefcase className='text-accent-1' />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography component='span' className='leading-4' variant='body1'>
                              Bags
                            </Typography>
                          }
                          secondary='24 products'
                        />
                        <Box className='flex flex-row gap-1'>
                          <Button
                            className='icon-only hover:text-text-primary hover:bg-grey-100 mt-1 flex-none opacity-0 group-hover:opacity-100'
                            size='tiny'
                            color='grey'
                            variant='text'
                            startIcon={<Plus size={16} />}
                          />
                          <Button
                            className='icon-only hover:text-text-primary hover:bg-grey-100 mt-1 flex-none opacity-0 group-hover:opacity-100'
                            size='tiny'
                            color='grey'
                            variant='text'
                            startIcon={<Ellipsis size={16} />}
                          />
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box>
                <Box>
                  <Typography variant='body2' className='text-text-disabled mb-2 font-medium'>
                    Users
                  </Typography>
                  <List>
                    <ListItem className='p-0'>
                      <ListItemButton classes={{ root: "group items-start" }}>
                        <ListItemAvatar>
                          <Avatar alt='Zoila Vittorino' src='/images/avatars/avatar-1.jpg' className='me-3' />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography component='span' className='leading-4' variant='body1'>
                              Zoila Vittorino
                            </Typography>
                          }
                          secondary='zoila.vittorino@gogo.dev'
                        />
                        <Button
                          className='icon-only hover:text-text-primary hover:bg-grey-100 mt-1 flex-none opacity-0 group-hover:opacity-100'
                          size='tiny'
                          color='grey'
                          variant='text'
                          startIcon={<Ellipsis size={16} />}
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem className='p-0'>
                      <ListItemButton classes={{ root: "group items-start" }}>
                        <ListItemAvatar>
                          <Avatar alt='Travis Howard' src='/images/avatars/avatar-2.jpg' className='me-3' />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography component='span' className='leading-4' variant='body1'>
                              Travis Howard
                            </Typography>
                          }
                          secondary='travis.howard@gogo.dev'
                        />
                        <Button
                          className='icon-only hover:text-text-primary hover:bg-grey-100 mt-1 flex-none opacity-0 group-hover:opacity-100'
                          size='tiny'
                          color='grey'
                          variant='text'
                          startIcon={<Ellipsis size={16} />}
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem className='p-0'>
                      <ListItemButton classes={{ root: "group items-start" }}>
                        <ListItemAvatar>
                          <Avatar alt='Olivia Bennett' src='/images/avatars/avatar-3.jpg' className='me-3' />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography component='span' className='leading-4' variant='body1'>
                              Olivia Bennett
                            </Typography>
                          }
                          secondary='olivia.bennett@gogo.dev'
                        />
                        <Button
                          className='icon-only hover:text-text-primary hover:bg-grey-100 mt-1 flex-none opacity-0 group-hover:opacity-100'
                          size='tiny'
                          color='grey'
                          variant='text'
                          startIcon={<Ellipsis size={16} />}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </TabPanel>
          </TabContext>
        </DialogContent>
        <DialogActions className='justify-center'>
          <Button variant='text' size='tiny' color='primary'>
            Advanced Search
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
