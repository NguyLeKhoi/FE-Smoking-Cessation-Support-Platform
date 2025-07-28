import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Input,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import SaveIcon from "@mui/icons-material/Save";
import HomeIcon from "@mui/icons-material/Home";
import CreateIcon from "@mui/icons-material/Create";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import postService from "../../services/postService";
import mediaService from "../../services/mediaService";
import { toast } from "react-toastify";
import BlogEditor from "../../components/blog/BlogEditor";

const CreateBlogPage = () => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnail: "",
    type: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [content, setContent] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  const postTypes = [
    { value: "health_benefits", label: "Health Benefits" },
    { value: "success_stories", label: "Success Stories" },
    { value: "tools_and_tips", label: "Tools & Tips" },
    { value: "smoking_dangers", label: "Smoking Dangers" },
    { value: "support_resources", label: "Support Resources" },
    { value: "news_and_research", label: "News & Research" },
  ];
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  }, [content]);



  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear field error when user starts typing/selecting
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }

    // Clear uploaded file when user enters URL
    if (field === 'thumbnail' && value && thumbnailPreview) {
      setThumbnailPreview('');
      setThumbnailFile(null);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters long";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    } else if (formData.content.trim().length < 10) {
      errors.content = "Content must be at least 10 characters long";
    }
    if (!formData.type) {
      errors.type = "Post type is required";
    }

    // Thumbnail validation for URL input
    if (formData.thumbnail && !thumbnailPreview && !isValidUrl(formData.thumbnail)) {
      errors.thumbnail = "Please enter a valid URL";
    }
    console.log(errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleThumbnailUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    try {
      setUploadingThumbnail(true);
      const formData = new FormData();
      formData.append('images', file);

      const response = await mediaService.uploadImages(formData);

      if (response.data && response.data.length > 0) {
        const uploadedUrlObj = response.data[0];
        const uploadedUrl = uploadedUrlObj.url || uploadedUrlObj;
        console.log('Uploaded thumbnail URL:', uploadedUrl);
        setFormData(prev => ({
          ...prev,
          thumbnail: uploadedUrl
        }));
        setThumbnailPreview(uploadedUrl);
        setThumbnailFile(null);
        toast.success('Thumbnail uploaded successfully!');
      } else {
        toast.error('Failed to upload thumbnail. No image URL received.');
      }
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      toast.error('Failed to upload thumbnail. Please try again.');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setThumbnailFile(file);
      // Clear URL input when uploading file
      setFormData(prev => ({ ...prev, thumbnail: '' }));
      handleThumbnailUpload(file);
    }
  };

  const handleCreate = async () => {
    const finalData = {
      ...formData,
      content: content,
    };
    if (!validateForm()) {
      toast.error("Please fix the form errors before creating");
      return;
    }

    try {
      setSaving(true);
      const newPost = await postService.createPost(finalData);
      console.log("Post created successfully:", newPost);
      navigate("/my-blog");
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/my-blog");
  };

  // Markdown styles
  const markdownStyles = {
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      marginTop: 2,
      marginBottom: 1,
      fontWeight: 600,
    },
    "& h1": { fontSize: "2rem" },
    "& h2": { fontSize: "1.5rem" },
    "& h3": { fontSize: "1.25rem" },
    "& p": {
      marginBottom: 1,
      lineHeight: 1.6,
    },
    "& ul, & ol": {
      marginLeft: 2,
      marginBottom: 1,
    },
    "& li": {
      marginBottom: 0.5,
    },
    "& blockquote": {
      borderLeft: "4px solid #ddd",
      paddingLeft: 2,
      margin: "1rem 0",
      fontStyle: "italic",
      color: "text.secondary",
    },
    "& code": {
      backgroundColor: "grey.100",
      padding: "2px 4px",
      borderRadius: 1,
      fontFamily: "monospace",
      fontSize: "0.875rem",
    },
    "& pre": {
      backgroundColor: "grey.100",
      padding: 2,
      borderRadius: 1,
      overflow: "auto",
      "& code": {
        backgroundColor: "transparent",
        padding: 0,
      },
    },
    "& a": {
      color: "primary.main",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    "& img": {
      maxWidth: "100%",
      height: "auto",
      borderRadius: 1,
    },
    "& table": {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: 2,
    },
    "& th, & td": {
      border: "1px solid #ddd",
      padding: 1,
      textAlign: "left",
    },
    "& th": {
      backgroundColor: "grey.100",
      fontWeight: 600,
    },
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "background.paper",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
          <Link
            component={RouterLink}
            to="/"
            underline="hover"
            color="inherit"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link
            component={RouterLink}
            to="/my-blog"
            underline="hover"
            color="inherit"
          >
            My Posts
          </Link>
          <Typography
            color="text.primary"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <CreateIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Create Post
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 600, mb: 2 }}
          >
            Create New Post
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Share your knowledge and experiences with the community using
            Markdown formatting.
          </Typography>
        </Box>

        {/* Create Form */}
        <Box sx={{ display: "flex", gap: 3 }}>
          {/* Left Column - Form */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={2} sx={{ p: 4 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Title and Type Fields Row */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  {/* Title Field */}
                  <TextField
                    label="Title"
                    fullWidth
                    value={formData.title}
                    onChange={handleInputChange("title")}
                    error={!!formErrors.title}
                    helperText={
                      formErrors.title ||
                      "Enter a compelling title for your post"
                    }
                    variant="outlined"
                    required
                    sx={{ flex: 2 }}
                  />

                  {/* Post Type Field */}
                  <FormControl
                    variant="outlined"
                    required
                    error={!!formErrors.type}
                    sx={{ flex: 1, minWidth: 200 }}
                  >
                    <InputLabel>Post Type</InputLabel>
                    <Select
                      value={formData.type}
                      onChange={handleInputChange("type")}
                      label="Post Type"
                    >
                      {postTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {formErrors.type || "Select the category for your post"}
                    </FormHelperText>
                  </FormControl>
                </Box>

                <Box>
                  <FormControl error={!!formErrors.content} fullWidth>
                    <BlogEditor content={content} setContent={setContent} />
                    <FormHelperText>
                      {formErrors.content || "Type your post content here."}
                    </FormHelperText>
                  </FormControl>
                </Box>
                {/* Thumbnail Section */}
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Thumbnail Image
                  </Typography>

                  {/* Option 1: File Upload */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Option 1: Upload Image File
                    </Typography>
                    <Box
                      sx={{
                        border: '2px dashed',
                        borderColor: 'grey.300',
                        borderRadius: 2,
                        p: 3,
                        textAlign: 'center',
                        backgroundColor: 'grey.50',
                        '&:hover': {
                          borderColor: 'primary.main',
                          backgroundColor: 'grey.100',
                        },
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                      onClick={() => document.getElementById('thumbnail-upload').click()}
                    >
                      <input
                        id="thumbnail-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        disabled={uploadingThumbnail}
                      />
                      {uploadingThumbnail ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={40} />
                          <Typography variant="body2" color="text.secondary">
                            Uploading thumbnail...
                          </Typography>
                        </Box>
                      ) : thumbnailPreview ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                          <Box
                            component="img"
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            sx={{
                              maxWidth: '100%',
                              maxHeight: 200,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid #ddd',
                            }}
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setThumbnailPreview('');
                              setFormData(prev => ({ ...prev, thumbnail: '' }));
                            }}
                          >
                            Remove Thumbnail
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                          <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                          <Typography variant="body1" color="text.secondary">
                            Click to upload thumbnail
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Supports: JPEG, PNG, GIF, WebP (max 5MB)
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Option 2: URL Input */}
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Option 2: Provide Image URL
                    </Typography>
                    <TextField
                      label="Thumbnail URL"
                      fullWidth
                      value={formData.thumbnail}
                      onChange={handleInputChange("thumbnail")}
                      error={!!formErrors.thumbnail}
                      helperText={
                        formErrors.thumbnail ||
                        "Enter a URL for the post thumbnail image"
                      }
                      variant="outlined"
                      placeholder="https://example.com/image.jpg"
                      disabled={!!thumbnailPreview}
                    />
                  </Box>

                  <FormHelperText>
                    Optional: Upload a thumbnail image or provide a URL for your post
                  </FormHelperText>
                </Box>
                <Divider />
                {/* Action Buttons */}
                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreate}
                    disabled={saving}
                    startIcon={
                      saving ? <CircularProgress size={20} /> : <SaveIcon />
                    }
                  >
                    {saving ? "Creating..." : "Create Post"}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>

          {/* Right Column - Info and Preview */}
          <Box
            sx={{
              width: 350,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* Current Selection Info */}
            {formData.type && (
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Post Category
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Selected:</strong>{" "}
                  {
                    postTypes.find((type) => type.value === formData.type)
                      ?.label
                  }
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  This helps other users find your content more easily.
                </Typography>
              </Paper>
            )}

            {/* Thumbnail Preview */}
            {(thumbnailPreview || (formData.thumbnail && isValidUrl(formData.thumbnail))) && (
              <Paper elevation={1} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Thumbnail Preview
                </Typography>
                <Box
                  component="img"
                  src={thumbnailPreview || formData.thumbnail}
                  alt="Thumbnail preview"
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: "1px solid #ddd",
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </Paper>
            )}

            {/* Publishing Info */}
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Publishing Info
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Status:</strong> Your post will be submitted for
                  review
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Visibility:</strong> Public after approval
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Format:</strong> Markdown supported
                </Typography>
              </Box>
              <Alert severity="info" sx={{ mt: 2 }}>
                Your post will be reviewed before being published to ensure it
                meets our community guidelines.
              </Alert>
            </Paper>
          </Box>
        </Box>
      </Container >
    </Box >
  );
};

export default CreateBlogPage;
