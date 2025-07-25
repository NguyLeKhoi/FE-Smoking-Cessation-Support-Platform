import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Chip,
  Divider,
  Alert,
  Button,
  Stack,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShareIcon from "@mui/icons-material/Share";
import MarkdownRenderer from "../../components/blog/MarkdownRenderer";
import postService from "../../services/postService";
import LoadingPage from "../LoadingPage";
import CommentsSection from "../../components/blog/CommentsSection";
import PostReactions from "../../components/blog/PostReactions";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        const response = await postService.getPostById(id);
        console.log("Post details:", response);

        if (response && response.data) {
          setPost(response.data);
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        console.error("Failed to fetch post details:", err);
        setError(
          "Failed to load post details. The post may have been removed or is unavailable."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (error || !post) {
    return (
      <Box sx={{ bgcolor: "background.paper", minHeight: "100vh" }}>
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleGoBack}
            sx={{ mb: 4 }}
          >
            Back to Blog
          </Button>
          <Alert severity="error" sx={{ my: 2 }}>
            {error || "Post not found"}
          </Alert>
        </Container>
      </Box>
    );
  }

  // Format date
  const publishDate = new Date(post.created_at);
  const formattedDate = publishDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Estimate read time (1 min per 200 words)
  const wordCount = post.content?.split(/\s+/).length || 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Extract first sentence for subtitle (from markdown)
  const getSubtitle = (content) => {
    if (!content) return "Helpful information to support your journey.";

    // Remove markdown formatting for subtitle
    const plainText = content
      .replace(/#{1,6}\s+/g, "") // Remove headers
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
      .replace(/\*(.*?)\*/g, "$1") // Remove italic
      .replace(/`(.*?)`/g, "$1") // Remove inline code
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // Remove links
      .trim();

    const firstSentence = plainText.split(".")[0];
    return firstSentence
      ? firstSentence + "."
      : "Helpful information to support your journey.";
  };

  return (
    <Box sx={{ bgcolor: "background.paper", py: 0 }}>
      <Container maxWidth="md" sx={{ pt: 2, pb: 8 }}>
        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{
            mb: 4,
            color: "text.secondary",
            fontWeight: 400,
            textTransform: "none",
            fontSize: "0.9rem",
          }}
        >
          Back
        </Button>
        {/* Post title */}
        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "2.5rem", sm: "3.25rem", md: "3rem" },
            lineHeight: 1.1,
            mb: 3,
            letterSpacing: "-0.03em",
            color: "#242424",
          }}
        >
          {post.title}
        </Typography>
        {/* Subtitle and category chip*/}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 2, sm: 1.5 },
            mb: 4,
          }}
        >
          {/* Subtitle */}
          <Typography
            variant="h2"
            sx={{
              fontSize: "1.35rem",
              color: "text.secondary",
              lineHeight: 1.4,
              fontWeight: 400,
              flexGrow: 1,
              mr: 2,
            }}
          >
            {getSubtitle(post.content)}
          </Typography>

          {/* Post category chip */}
          {post.type && (
            <Chip
              label={post.type.replace(/_/g, " ")}
              color="primary"
              size="small"
              variant="outlined"
              sx={{
                textTransform: "capitalize",
                fontWeight: 500,
                borderRadius: "10px",
                flexShrink: 0,
              }}
            />
          )}
        </Box>
        {/* Author and meta information */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            mb: 5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              src={
                post.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${post.first_name} ${post.last_name}`
              }
              alt={`${post.first_name} ${post.last_name}`}
              sx={{ width: 48, height: 48 }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="text.primary"
              >
                {post.first_name} {post.last_name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {formattedDate}
                </Typography>
                <Box component="span" sx={{ color: "text.secondary" }}>
                  ·
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {readTime} min read
                </Typography>
              </Box>
            </Box>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mt: { xs: 2, sm: 0 } }}>
            <Button
              size="small"
              startIcon={<BookmarkIcon />}
              sx={{
                color: "text.secondary",
                borderRadius: "20px",
                px: 2,
              }}
            >
              Save
            </Button>
            <Button
              size="small"
              startIcon={<ShareIcon />}
              sx={{
                color: "text.secondary",
                borderRadius: "20px",
                px: 2,
              }}
            >
              Share
            </Button>
          </Stack>
        </Box>
        {/* Main image */}
        {post.thumbnail && (
          <Box
            sx={{
              width: "100%",
              borderRadius: 8,
              overflow: "hidden",
              mb: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={post.thumbnail}
              alt={post.title}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                maxHeight: "450px",
                minHeight: "450px",
                objectFit: "cover",
              }}
            />
          </Box>
        )}

        {/* Post content - Use both MarkdownRenderer with custom styling and ReactMarkdown */}
        <Box sx={{ mb: 5 }}>
          <MarkdownRenderer
            content={post.content}
            sx={{
              fontSize: { xs: "1.1rem", md: "1.2rem" },
              lineHeight: 1.7,
              color: "#242424",
              letterSpacing: "0.01em",
              "& p": {
                mb: 3,
                fontSize: "inherit",
                lineHeight: "inherit",
              },
              "& h1": {
                fontSize: "2.25rem",
                fontWeight: 700,
                mt: 6,
                mb: 3,
                letterSpacing: "-0.02em",
              },
              "& h2": {
                fontSize: "1.75rem",
                fontWeight: 700,
                mt: 5,
                mb: 3,
                letterSpacing: "-0.01em",
              },
              "& h3": {
                fontSize: "1.35rem",
                fontWeight: 600,
                mt: 4,
                mb: 2,
              },
              "& h4": {
                fontSize: "1.15rem",
                fontWeight: 600,
                mt: 3,
                mb: 2,
              },
              "& ul, & ol": {
                pl: 4,
                mb: 3,
                "& li": {
                  mb: 1,
                  fontSize: "inherit",
                  lineHeight: "inherit",
                },
              },
              "& blockquote": {
                borderLeft: "4px solid #ddd",
                paddingLeft: 3,
                margin: "2rem 0",
                fontStyle: "italic",
                color: "text.secondary",
                fontSize: "1.1rem",
                "& p": {
                  fontSize: "inherit",
                  fontStyle: "inherit",
                },
              },
              "& code": {
                backgroundColor: "grey.100",
                padding: "3px 6px",
                borderRadius: 1,
                fontFamily: "monospace",
                fontSize: "0.9em",
              },
              "& pre": {
                backgroundColor: "grey.100",
                padding: 3,
                borderRadius: 1,
                overflow: "auto",
                mb: 3,
                "& code": {
                  backgroundColor: "transparent",
                  padding: 0,
                  fontSize: "0.875rem",
                },
              },
              "& img": {
                maxWidth: "100%",
                height: "auto",
                borderRadius: 2,
                my: 3,
                display: "block",
                margin: "2rem auto",
              },
              "& a": {
                color: "primary.main",
                textDecoration: "underline",
                "&:hover": {
                  textDecoration: "none",
                },
              },
              "& table": {
                width: "100%",
                borderCollapse: "collapse",
                mb: 3,
                fontSize: "1rem",
                "& th, & td": {
                  border: "1px solid #ddd",
                  padding: 2,
                  textAlign: "left",
                },
                "& th": {
                  backgroundColor: "grey.100",
                  fontWeight: 600,
                },
              },
              "& hr": {
                border: "none",
                borderTop: "1px solid #eee",
                my: 4,
              },
            }}
          />
        </Box>
        <Divider sx={{ my: 5 }} />
        {post.id && <PostReactions postId={post.id} />}
        {post.id && <CommentsSection postId={post.id} />}
      </Container>
    </Box>
  );
};

export default BlogDetails;
