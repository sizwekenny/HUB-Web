import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface Video {
  name: string;
  url: string;
}

const videos: Video[] = [
  { name: "Small Gate Ruth First", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/jay/small+gate-ruth+first.mp4" },
  { name: "Small Gate B5", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/jay/small+gate-b5.mp4" },
  { name: "Ruth First Clinic", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/jay/ruth+first+-clinic+.mp4" },
  { name: "One Stop Res Admin", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/jay/one+stop-+res+admin.mp4" },
  { name: "One Stop Cafeteria", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/jay/one+stop-+cafeteria+.mp4" },
  { name: "Main Gate B5", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/jay/main+gate-+b5.mp4" },
  { name: "iCenter Exam", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/jay/icenter-exam.mp4" },
  { name: "iCenter B10", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/jay/icenter-b10.mp4" },
  { name: "B5 One Stop", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/jay/b5-one+stop.mp4" },
  { name: "B5 NSFAS", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/jay/b5-nsfas.mp4" },
];

const qualityOptions = [
  { label: 'Auto', value: 'auto' },
  { label: '1080p', value: '1080' },
  { label: '720p', value: '720' },
  { label: '480p', value: '480' },
  { label: '360p', value: '360' },
];

const CampusVideosPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0]);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const navigate = useNavigate();
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const filteredVideos = videos.filter(video =>
    video.name.toLowerCase().includes(search.toLowerCase())
  );

  // Simulate quality switching by changing URL (if you have multiple sources per video)
  // Here, we just reload the same video for demo, but you can adapt if you have quality-specific URLs
  const getVideoUrl = (video: Video | null) => {
    if (!video) return '';
    if (quality === 'auto') return video.url;
    return video.url.replace('.mp4', `-${quality}.mp4`);
  };

  // Update playback rate on video element
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, selectedVideo]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#003884] text-white p-6 shadow-md flex justify-center items-center">
  <h1 className="text-3xl font-bold text-center">Campus Video Tour</h1>
</header>

      {/* Search Bar */}
      <div className="max-w-6xl mx-auto px-4 py-6">
             <button
    onClick={() => navigate('/home')}
    className="px-4 py-2 bg-blue-600 text-white rounded whitespace-nowrap"
  >
    Back to Home
  </button>
  <div className="h-4"></div>
        <input
          type="text"
          placeholder="Search videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003884]"
        />
     
      </div>

      {/* Video Player */}
      {selectedVideo && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="flex gap-4 items-center mb-2 flex-wrap">
            <label className="font-medium">Speed:</label>
            <select value={playbackRate} onChange={e => setPlaybackRate(Number(e.target.value))} className="rounded border-gray-300">
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
            <label className="font-medium ml-4">Quality:</label>
            <select value={quality} onChange={e => setQuality(e.target.value)} className="rounded border-gray-300">
              {qualityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <video
            key={getVideoUrl(selectedVideo)}
            ref={videoRef}
            src={getVideoUrl(selectedVideo)}
            controls
            className="w-full h-[500px] rounded-lg shadow-lg object-cover"
            style={{ background: '#000' }}
          />
          <h2 className="mt-2 text-xl font-semibold">{selectedVideo.name}</h2>
        </div>
      )}

      {/* Video List */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {filteredVideos.map((video, index) => (
          <div
            key={index}
            onClick={() => setSelectedVideo(video)}
            className="cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-white"
          >
            <video
              src={video.url}
              className="w-full h-40 object-cover"
              muted
            />
            <div className="p-3">
              <p className="font-medium">{video.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampusVideosPage;