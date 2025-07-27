import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tabs,
  Tab,
  Button,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";

const NotificationsDropdown = ({ notifications, onClose, onMarkAllAsRead }) => {
  const [tabValue, setTabValue] = useState(0); // 0 for All, 1 for Unread
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredNotifications =
    tabValue === 0
      ? notifications
      : notifications.filter((notification) => !notification.is_read);

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "60px", // Adjust based on your header height
        right: "10px",
        width: 360,
        maxHeight: 450,
        overflowY: "auto",
        bgcolor: "background.paper",
        boxShadow: 3,
        borderRadius: "8px",
        zIndex: 1300, // Ensure it's above the header
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Notifications</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="notification tabs"
          variant="fullWidth"
        >
          <Tab label="All Notifications" />
          <Tab
            label={`Unread (${notifications.filter((n) => !n.is_read).length})`}
          />
        </Tabs>
      </Box>
      <Divider />

      {filteredNotifications.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ p: 2, textAlign: "center" }}
        >
          No notifications.
        </Typography>
      ) : (
        <List sx={{ flexGrow: 1, p: 0 }}>
          {filteredNotifications.map((notification, index) => (
            <React.Fragment key={notification.id || index}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  bgcolor: notification.is_read
                    ? "transparent"
                    : "action.hover", // Highlight unread
                  "&:hover": { bgcolor: "action.selected" },
                  px: 2,
                  py: 1.5,
                }}
              >
                {/* You can add icons or avatars here based on notification type */}
                <ListItemText
                  primary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      fontWeight={notification.is_read ? "normal" : "bold"}
                      sx={{ mb: 0.5 }}
                    >
                      {notification.title || 'Notification'}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: 'block', mb: 0.5 }}
                      >
                        {notification.content || ''}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block' }}
                      >
                        {notification.timestamp || ''}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < filteredNotifications.length - 1 && (
                <Divider component="li" />
              )}
            </React.Fragment>
          ))}
        </List>
      )}

      {notifications.length > 0 && (
        <Box
          sx={{
            p: 1,
            display: "flex",
            justifyContent: "flex-end",
            bgcolor: "background.paper",
          }}
        >
          <Button
            startIcon={<CheckCircleOutlineIcon />}
            onClick={onMarkAllAsRead}
            disabled={notifications.filter((n) => !n.is_read).length === 0}
          >
            Mark all as read
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default NotificationsDropdown;
