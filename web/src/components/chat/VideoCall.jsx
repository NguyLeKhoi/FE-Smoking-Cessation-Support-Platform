import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Fade,
  Tooltip,
} from "@mui/material";
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd,
  Fullscreen,
  FullscreenExit,
  MoreVert,
  PresentToAll,
  Settings,
  OpenInFull,
  CloseFullscreen,
} from "@mui/icons-material";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  useLocalAudioTrack,
  useLocalVideoTrack,
  useMaybeRoomContext,
  useRoomContext,
  useParticipants,
  ParticipantTile,
  useTracks,
  VideoTrack,
  AudioTrack,
} from "@livekit/components-react";
import { Track } from "livekit-client";
// import "../../styles/VideoCall.css";

const ParticipantBox = ({ participant }) => {
  const videoTrack = participant.getTrackPublication(Track.Source.Camera);
  const audioTrack = participant.getTrackPublication(Track.Source.Microphone);

  const hasVideo = videoTrack?.isSubscribed && videoTrack?.videoTrack;
  const hasAudio = audioTrack?.isSubscribed && audioTrack?.audioTrack;

  return (
    <Box
      sx={{
        width: "50%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        bgcolor: "#1e1e1e",
        position: "relative",
      }}
    >
      {hasVideo ? (
        <VideoTrack
          trackRef={{
            participant,
            publication: videoTrack,
            source: Track.Source.Camera,
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          sx={{
            textAlign: "center",
            color: "white",
          }}
        >
          <Avatar
            sx={{
              width: 100,
              height: 100,
              mx: "auto",
              bgcolor: "#444",
              fontSize: 40,
            }}
          >
            {participant.identity?.charAt(0)?.toUpperCase() || "P"}
          </Avatar>
          <Typography variant="h6" mt={2}>
            {participant.identity}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            Camera is off
          </Typography>
        </Box>
      )}

      {hasAudio && (
        <AudioTrack
          trackRef={{
            participant,
            publication: audioTrack,
            source: Track.Source.Microphone,
          }}
        />
      )}
    </Box>
  );
};

export const TwoParticipantsView = () => {
  const participants = useParticipants();
  const local = participants.find((p) => p.isLocal);
  const remote = participants.find((p) => !p.isLocal);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
      }}
    >
      {local && <ParticipantBox participant={local} />}
      {remote && <ParticipantBox participant={remote} />}
    </Box>
  );
};

const ExpandedParticipantView = ({ participant, onClose }) => {
  const videoTrack = participant.getTrackPublication(Track.Source.Camera);
  const audioTrack = participant.getTrackPublication(Track.Source.Microphone);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        bgcolor: "#000",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header with close button */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10001,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, transparent 100%)",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
          {participant?.identity || "Participant"} - Full Screen
        </Typography>
        <Tooltip title="Exit full screen">
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            <CloseFullscreen />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Full screen participant video */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {videoTrack && videoTrack.videoTrack ? (
          <VideoTrack
            trackRef={{
              participant: participant,
              publication: videoTrack,
              source: Track.Source.Camera,
            }}
            style={{
              width: "50%",
              height: "50%",
              objectFit: "contain",
            }}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: "3rem",
                bgcolor: "#333",
              }}
            >
              {participant?.identity?.charAt(0)?.toUpperCase() || "P"}
            </Avatar>
            <Typography variant="h5">
              {participant?.identity || "Participant"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Camera is off
            </Typography>
          </Box>
        )}

        {/* Audio track for sound */}
        {audioTrack && audioTrack.audioTrack && (
          <AudioTrack
            trackRef={{
              participant: participant,
              publication: audioTrack,
              source: Track.Source.Microphone,
            }}
          />
        )}
      </Box>
    </Box>
  );
};

const VideoCallControls = ({ onDisconnect, isExpanded, onToggleExpand }) => {
  const room = useMaybeRoomContext();
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [expandedParticipant, setExpandedParticipant] = useState(null);

  const participants = useParticipants();
  const remoteParticipants = participants.filter((p) => !p.isLocal);

  const toggleAudio = async () => {
    if (room) {
      try {
        await room.localParticipant.setMicrophoneEnabled(!isAudioEnabled);
        setIsAudioEnabled(!isAudioEnabled);
      } catch (error) {
        console.warn("Audio toggle error:", error.message);
        // Still update the state even if there's a device error
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  const toggleVideo = async () => {
    if (room) {
      try {
        await room.localParticipant.setCameraEnabled(!isVideoEnabled);
        setIsVideoEnabled(!isVideoEnabled);
      } catch (error) {
        console.warn("Video toggle error:", error.message);
        // Still update the state even if there's a device error
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleScreenShare = async () => {
    if (room) {
      try {
        if (isScreenSharing) {
          await room.localParticipant.setScreenShareEnabled(false);
        } else {
          await room.localParticipant.setScreenShareEnabled(true);
        }
        setIsScreenSharing(!isScreenSharing);
      } catch (error) {
        console.warn("Screen share error:", error.message);
      }
    }
  };

  const expandParticipant = () => {
    if (remoteParticipants.length > 0) {
      setExpandedParticipant(remoteParticipants[0]);
    }
  };

  // Listen for track changes to update button states
  useEffect(() => {
    if (!room) return;

    const updateAudioState = () => {
      const audioTrack = room.localParticipant.getTrackPublication(
        Track.Source.Microphone
      );
      setIsAudioEnabled(audioTrack?.isEnabled ?? true);
    };

    const updateVideoState = () => {
      const videoTrack = room.localParticipant.getTrackPublication(
        Track.Source.Camera
      );
      setIsVideoEnabled(videoTrack?.isEnabled ?? true);
    };

    const updateScreenShareState = () => {
      const screenTrack = room.localParticipant.getTrackPublication(
        Track.Source.ScreenShare
      );
      setIsScreenSharing(screenTrack?.isEnabled ?? false);
    };

    // Initial state
    updateAudioState();
    updateVideoState();
    updateScreenShareState();

    // Listen for track events
    room.localParticipant.on("trackMuted", updateAudioState);
    room.localParticipant.on("trackUnmuted", updateAudioState);
    room.localParticipant.on("trackPublished", () => {
      updateAudioState();
      updateVideoState();
      updateScreenShareState();
    });
    room.localParticipant.on("trackUnpublished", () => {
      updateAudioState();
      updateVideoState();
      updateScreenShareState();
    });

    return () => {
      room.localParticipant.off("trackMuted", updateAudioState);
      room.localParticipant.off("trackUnmuted", updateAudioState);
    };
  }, [room]);

  return (
    <>
      <Fade in timeout={1000}>
        <Box
          sx={{
            position: "absolute",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 2,
            p: 2,
            borderRadius: "24px",
            bgcolor: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
            zIndex: 10,
          }}
        >
          {/* Microphone Button */}
          <Tooltip title={isAudioEnabled ? "Mute" : "Unmute"}>
            <IconButton
              onClick={toggleAudio}
              sx={{
                width: 56,
                height: 56,
                bgcolor: isAudioEnabled
                  ? "rgba(67, 56, 202, 0.2)"
                  : "rgba(239, 68, 68, 0.2)",
                color: isAudioEnabled ? "#4F46E5" : "#EF4444",
                border: `2px solid ${isAudioEnabled ? "#4F46E5" : "#EF4444"}`,
                "&:hover": {
                  bgcolor: isAudioEnabled
                    ? "rgba(67, 56, 202, 0.3)"
                    : "rgba(239, 68, 68, 0.3)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {isAudioEnabled ? <Mic /> : <MicOff />}
            </IconButton>
          </Tooltip>

          {/* Video Button */}
          <Tooltip
            title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
          >
            <IconButton
              onClick={toggleVideo}
              sx={{
                width: 56,
                height: 56,
                bgcolor: isVideoEnabled
                  ? "rgba(67, 56, 202, 0.2)"
                  : "rgba(239, 68, 68, 0.2)",
                color: isVideoEnabled ? "#4F46E5" : "#EF4444",
                border: `2px solid ${isVideoEnabled ? "#4F46E5" : "#EF4444"}`,
                "&:hover": {
                  bgcolor: isVideoEnabled
                    ? "rgba(67, 56, 202, 0.3)"
                    : "rgba(239, 68, 68, 0.3)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              {isVideoEnabled ? <Videocam /> : <VideocamOff />}
            </IconButton>
          </Tooltip>

          {/* Screen Share Button */}
          <Tooltip title={isScreenSharing ? "Stop sharing" : "Share screen"}>
            <IconButton
              onClick={toggleScreenShare}
              sx={{
                width: 56,
                height: 56,
                bgcolor: isScreenSharing
                  ? "rgba(67, 56, 202, 0.2)"
                  : "rgba(156, 163, 175, 0.2)",
                color: isScreenSharing ? "#4F46E5" : "#9CA3AF",
                border: `2px solid ${isScreenSharing ? "#4F46E5" : "#9CA3AF"}`,
                "&:hover": {
                  bgcolor: isScreenSharing
                    ? "rgba(67, 56, 202, 0.3)"
                    : "rgba(156, 163, 175, 0.3)",
                  transform: "scale(1.1)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <PresentToAll />
            </IconButton>
          </Tooltip>

          {/* Expand Participant Button */}
          <Tooltip
            title={
              remoteParticipants.length > 0
                ? "Expand participant to full screen"
                : "No participants to expand"
            }
          >
            <IconButton
              onClick={expandParticipant}
              disabled={remoteParticipants.length === 0}
              sx={{
                width: 56,
                height: 56,
                bgcolor: "rgba(156, 163, 175, 0.2)",
                color:
                  remoteParticipants.length > 0
                    ? "#9CA3AF"
                    : "rgba(156, 163, 175, 0.5)",
                border: `2px solid ${
                  remoteParticipants.length > 0
                    ? "#9CA3AF"
                    : "rgba(156, 163, 175, 0.5)"
                }`,
                "&:hover": {
                  bgcolor:
                    remoteParticipants.length > 0
                      ? "rgba(156, 163, 175, 0.3)"
                      : "rgba(156, 163, 175, 0.2)",
                  transform:
                    remoteParticipants.length > 0 ? "scale(1.1)" : "none",
                },
                transition: "all 0.2s ease-in-out",
                "&.Mui-disabled": {
                  color: "rgba(156, 163, 175, 0.5)",
                  border: "2px solid rgba(156, 163, 175, 0.5)",
                },
              }}
            >
              <OpenInFull />
            </IconButton>
          </Tooltip>

          {/* End Call Button */}
          <Tooltip title="Leave call">
            <IconButton
              onClick={onDisconnect}
              sx={{
                width: 56,
                height: 56,
                bgcolor: "#DC2626",
                color: "white",
                border: "2px solid #DC2626",
                "&:hover": {
                  bgcolor: "#B91C1C",
                  transform: "scale(1.1)",
                  boxShadow: "0 4px 20px rgba(220, 38, 38, 0.4)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              <CallEnd />
            </IconButton>
          </Tooltip>
        </Box>
      </Fade>

      {/* Expanded Participant View */}
      {expandedParticipant && (
        <ExpandedParticipantView
          participant={expandedParticipant}
          onClose={() => setExpandedParticipant(null)}
        />
      )}
    </>
  );
};

const CALL_TIMEOUT_MS = 1 * 60 * 1000 * 60; // 1 minute for testing

const VideoCall = ({ token, roomName, onDisconnect }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [identity, setIdentity] = useState(null);
  const timeoutRef = useRef(null);

  const serverUrl = process.env.REACT_APP_LIVEKIT_URL || "ws://localhost:7880";

  // Extract identity from token
  useEffect(() => {
    if (token) {
      try {
        const [header, payload, signature] = token.split(".");
        const decodedPayload = JSON.parse(atob(payload));
        const extractedIdentity = decodedPayload.sub;
        setIdentity(extractedIdentity);
      } catch (e) {
        setIdentity("user"); // fallback
      }
    }
  }, [token]);

  // Video call timeout logic
  useEffect(() => {
    // Start timeout when call starts
    timeoutRef.current = setTimeout(() => {
      alert(
        "This video call has reached the maximum allowed duration and will now end."
      );
      if (onDisconnect) onDisconnect();
    }, CALL_TIMEOUT_MS);

    // Cleanup on unmount or call end
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onDisconnect]);

  const handleDisconnect = () => {
    if (onDisconnect) {
      onDisconnect();
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        bgcolor: "#0D1117",
        display: "flex",
        flexDirection: "column",
        color: "white",
        transform: isExpanded ? "scale(1.1)" : "scale(1)",
        transition: "transform 0.3s ease-in-out",
      }}
    >
      {/* Top Header Bar */}
      <Fade in timeout={800}>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)",
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Call Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                bgcolor: "#00D26A",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { opacity: 1, transform: "scale(1)" },
                  "50%": { opacity: 0.5, transform: "scale(1.1)" },
                  "100%": { opacity: 1, transform: "scale(1)" },
                },
              }}
            />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "white" }}>
              {identity || "Video Call"}
            </Typography>
            {isExpanded && (
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)" }}
              >
                • Expanded View
              </Typography>
            )}
          </Box>

          {/* Top Controls */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Settings">
              <IconButton
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  backdropFilter: "blur(10px)",
                }}
              >
                <Settings />
              </IconButton>
            </Tooltip>
            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <IconButton
                onClick={toggleFullscreen}
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  backdropFilter: "blur(10px)",
                }}
              >
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
            <Tooltip title="More">
              <IconButton
                sx={{
                  color: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                  backdropFilter: "blur(10px)",
                }}
              >
                <MoreVert />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Fade>

      {/* Main Video Area */}
      <Box
        sx={{
          flexGrow: 1,
          position: "relative",
          background:
            "radial-gradient(circle at center, #1a1a2e 0%, #16213e 50%, #0D1117 100%)",
        }}
      >
        {identity ? (
          <LiveKitRoom
            video={true}
            audio={true}
            key={token} // Force re-mount when token changes
            token={token}
            serverUrl={serverUrl}
            options={{
              adaptiveStream: true,
              dynacast: true,
            }}
            connectOptions={{
              autoSubscribe: true,
            }}
            style={{
              height: "100%",
              borderRadius: "0px",
            }}
            onDisconnected={(reason) => {
              console.log("🔌 LiveKit disconnected, reason:", reason);
              handleDisconnect();
            }}
            onConnected={() => {
              console.log("✅ LiveKit connected successfully!");
              console.log("✅ Connected with identity:", identity);
            }}
            onError={(error) => {
              console.error("❌ LiveKit connection error:", error);
              console.error("❌ Error details:", error.message);
              console.error("❌ Token:", token);
              console.error("❌ Identity:", identity);
              console.error("❌ Server URL:", serverUrl);
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TwoParticipantsView />
                <RoomAudioRenderer />
                <VideoCallControls
                  onDisconnect={handleDisconnect}
                  isExpanded={isExpanded}
                  onToggleExpand={toggleExpand}
                />

                <RoomAudioRenderer />
                <VideoCallControls
                  onDisconnect={handleDisconnect}
                  isExpanded={isExpanded}
                  onToggleExpand={toggleExpand}
                />
              </Box>
            </Box>
          </LiveKitRoom>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              height: "50%",
              color: "white",
              gap: 3,
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#5865F2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "spin 2s linear infinite",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            >
              <Videocam sx={{ fontSize: 40, color: "white" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Connecting to call...
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.7 }}>
              Setting up your video and audio
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default VideoCall;
