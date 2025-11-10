import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings, 
  ChevronLeft,
  Grid3X3,
  List,
  Clock,
  MapPin,
  Building,
  GraduationCap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Video {
  name: string;
  url: string;
  category?: string;
  duration?: string;
}

const videos: Video[] = [
  { name: "Building 01 G01 & G02 - To Library", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/Polokwane/Bld+01+G01+%26+02+-+To+-+Library.mp4", category: "Academic Buildings", duration: "2:30" },
  { name: "Building 01 G01 & G02 Entrance - To I-Center", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/Polokwane/BLD+01+G01+%26+02+Entrance+-+To+-+I-center.mp4", category: "Academic Buildings", duration: "1:45" },
  { name: "Building 01 G01 & G02 - To Financial Aid - To SDS", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/Polokwane/Bld+01+G01+and+02+-+To+-+Financial+-+To+-+SDS.mp4", category: "Student Services", duration: "3:15" },
  { name: "Building 01 G01 & G02 Entrance - To I-Center - To Library", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/Polokwane/Bld+01+G01+and+02+Entrance+-+To+-+Icenter+-+To+-+L.mp4", category: "Academic Buildings", duration: "2:00" },
  { name: "Building 01 G01 Entrance - To Financial Aid - To SDS", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/Polokwane/Bld+01+G01+Entrance+-+To-+Financial+Aid+-+To+-+SDS.mp4", category: "Student Services", duration: "2:45" },
  { name: "Building 01 G01 & G02 Entrance - To ICT Faculty", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/Polokwane/Bld+1+G01+%26+02+entrance+-+To+-+ICt+Faculty.mp4", category: "ICT Faculty", duration: "1:30" },
  { name: "Clinic Entrance - To ICEP Office", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/Polokwane/Clinic+entrance+-+To+-+ICEP+office.mp4", category: "Health Services", duration: "2:15" },
  { name: "Ground - To Lecturer Room - To Lab", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/Polokwane/Ground+-+To+-+Lecturer+Room+-+To+-Lab.mp4", category: "Academic Buildings", duration: "3:00" },
  { name: "Main - To Admin", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/Polokwane/Main+-+To+-+Admin.mp4", category: "Administration", duration: "1:50" },
  { name: "Main Gate - To Cashiers - To Student Card", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/Polokwane/Main+Gate+-+To+-+Cashiers+-+To+-+Student+card.mp4", category: "Student Services", duration: "2:20" },
  { name: "Main Gate - To Clinic", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/Polokwane/Main+Gate+-+To+-+Clinic.mp4", category: "Health Services", duration: "1:40" },
  { name: "Main Gate - To SDS - To Clinic", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/Polokwane/Main+gate+-+To+-+SDS+-+To+-+Clinic.mp4", category: "Student Services", duration: "2:50" },
  { name: "Main Gate - To Clinic Entrance", url: "https://ict-info-app.s3.eu-west-1.amazonaws.com/CampusTour/Polokwane/Main+Gate+to+Clinic+Entrance.mp4", category: "Health Services", duration: "1:35" },
];

const qualityOptions = [
  { label: 'Auto', value: 'auto' },
  { label: '1080p', value: '1080' },
  { label: '720p', value: '720' },
  { label: '480p', value: '480' },
  { label: '360p', value: '360' },
];

const playbackRates = [
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '2x', value: 2 },
];

const categories = ['All', 'Academic Buildings', 'ICT Faculty', 'Student Services', 'Health Services', 'Administration'];

const CampusVideosPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0]);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('auto');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showVideoList, setShowVideoList] = useState(true);
  const [visibleVideosCount, setVisibleVideosCount] = useState(6);
  const navigate = useNavigate();
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const videoListRef = useRef<HTMLDivElement>(null);

  const filteredVideos = videos.filter(video =>
    video.name.toLowerCase().includes(search.toLowerCase()) &&
    (selectedCategory === 'All' || video.category === selectedCategory)
  );

  const visibleVideos = filteredVideos.slice(0, visibleVideosCount);
  const hasMoreVideos = visibleVideos.length < filteredVideos.length;

  const getVideoUrl = (video: Video | null) => {
    if (!video) return '';
    if (quality === 'auto') return video.url;
    return video.url.replace('.mp4', `-${quality}.mp4`);
  };

  useEffect(() => {
    if (mainVideoRef.current) {
      mainVideoRef.current.playbackRate = playbackRate;
      mainVideoRef.current.volume = isMuted ? 0 : volume;
    }
  }, [playbackRate, volume, isMuted, selectedVideo]);

  const handlePlayPause = () => {
    if (mainVideoRef.current) {
      if (isPlaying) {
        mainVideoRef.current.pause();
      } else {
        mainVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
    setTimeout(() => {
      if (mainVideoRef.current) {
        mainVideoRef.current.play();
      }
    }, 100);
    
    // On mobile, hide video list after selection
    if (window.innerWidth < 1024) {
      setShowVideoList(false);
    }
  };

  const loadMoreVideos = () => {
    setVisibleVideosCount(prev => prev + 6);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Academic Buildings': return <Building className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'ICT Faculty': return <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'Student Services': return <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'Health Services': return <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'Administration': return <Building className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/polHome')}
                className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-[#003884] text-white rounded-lg hover:bg-[#00245c] transition-colors duration-200 text-sm sm:text-base"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </button>
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Campus Virtual Tour</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile toggle for video list */}
              <button
                onClick={() => setShowVideoList(!showVideoList)}
                className="lg:hidden flex items-center space-x-1 px-3 py-2 bg-[#003884] text-white rounded-lg text-sm"
              >
                <span>Videos</span>
                {showVideoList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <div className="hidden sm:flex bg-white border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-[#003884] text-white' : 'text-gray-600'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-[#003884] text-white' : 'text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Search and Filters */}
        <div className="mb-6 sm:mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search campus locations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003884] focus:border-transparent bg-white text-sm sm:text-base"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#003884] focus:border-transparent bg-white text-sm sm:text-base min-w-[140px] sm:min-w-[200px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {categories.filter(cat => cat !== 'All').map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-[#003884] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Video Player Section - Always visible */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Main Video Player */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="relative aspect-video bg-black">
                <video
                  key={getVideoUrl(selectedVideo)}
                  ref={mainVideoRef}
                  src={getVideoUrl(selectedVideo)}
                  className="w-full h-full object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
                
                {/* Video Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                          onClick={handlePlayPause}
                          className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-1 sm:p-2 transition-colors duration-200"
                        >
                          {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                        
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="text-white hover:text-gray-300 transition-colors duration-200"
                        >
                          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                        
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-16 sm:w-20 accent-white"
                        />
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={() => setShowSettings(!showSettings)}
                          className="text-white hover:text-gray-300 transition-colors duration-200 p-1 sm:p-2"
                        >
                          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        
                        {showSettings && (
                          <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-3 sm:p-4 min-w-[180px] sm:min-w-[200px]">
                            <div className="space-y-2 sm:space-y-3">
                              <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Playback Speed</label>
                                <select
                                  value={playbackRate}
                                  onChange={(e) => setPlaybackRate(Number(e.target.value))}
                                  className="w-full rounded-lg border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                                >
                                  {playbackRates.map(rate => (
                                    <option key={rate.value} value={rate.value}>{rate.label}</option>
                                  ))}
                                </select>
                              </div>
                              
                              <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Quality</label>
                                <select
                                  value={quality}
                                  onChange={(e) => setQuality(e.target.value)}
                                  className="w-full rounded-lg border border-gray-300 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm"
                                >
                                  {qualityOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">{selectedVideo?.name}</h2>
                {selectedVideo?.category && (
                  <div className="flex items-center space-x-3 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    <span className="flex items-center space-x-1">
                      {getCategoryIcon(selectedVideo.category)}
                      <span>{selectedVideo.category}</span>
                    </span>
                    {selectedVideo.duration && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{selectedVideo.duration}</span>
                      </span>
                    )}
                  </div>
                )}
                <p className="text-gray-600 text-sm sm:text-base">
                  Explore this campus location through our immersive virtual tour.
                </p>
              </div>
            </div>

            {/* Quick Stats - Hidden on mobile for space */}
            <div className="hidden sm:grid grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl p-3 sm:p-4 text-center shadow-sm border border-gray-200">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#003884]">{videos.length}</div>
                <div className="text-xs sm:text-sm text-gray-600">Tour Videos</div>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 text-center shadow-sm border border-gray-200">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#003884]">
                  {Array.from(new Set(videos.map(v => v.category))).length}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Categories</div>
              </div>
              <div className="bg-white rounded-xl p-3 sm:p-4 text-center shadow-sm border border-gray-200">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-[#003884]">100%</div>
                <div className="text-xs sm:text-sm text-gray-600">Campus Coverage</div>
              </div>
            </div>
          </div>

          {/* Video List - Responsive behavior */}
          <div className={`lg:col-span-1 transition-all duration-300 ${
            showVideoList ? 'block' : 'hidden lg:block'
          }`}>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 max-h-[600px] lg:max-h-[800px] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Campus Locations</h3>
                <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {filteredVideos.length}
                </span>
              </div>
              
              <div 
                ref={videoListRef}
                className={`flex-1 overflow-y-auto space-y-2 sm:space-y-3 ${
                  viewMode === 'grid' ? 'grid grid-cols-1 gap-2 sm:gap-3' : 'space-y-2 sm:space-y-3'
                }`}
              >
                {visibleVideos.map((video, index) => (
                  <div
                    key={index}
                    onClick={() => handleVideoSelect(video)}
                    className={`cursor-pointer rounded-lg sm:rounded-xl border-2 transition-all duration-200 group ${
                      selectedVideo?.url === video.url
                        ? 'border-[#003884] bg-blue-50'
                        : 'border-gray-200 hover:border-[#003884] hover:bg-gray-50'
                    } ${viewMode === 'grid' ? 'p-2 sm:p-3' : 'p-3 sm:p-4'}`}
                  >
                    <div className={`flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row space-x-2 sm:space-x-3'} items-start`}>
                      <div className="relative flex-shrink-0">
                        <video
                          src={video.url}
                          className={`rounded bg-gray-200 ${
                            viewMode === 'grid' ? 'w-full h-16 sm:h-20' : 'w-20 sm:w-24 h-14 sm:h-16'
                          } object-cover`}
                          muted
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded flex items-center justify-center">
                          <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </div>
                      </div>
                      
                      <div className={`flex-1 min-w-0 ${viewMode === 'grid' ? 'mt-1 sm:mt-2' : ''}`}>
                        <h4 className="font-medium text-gray-900 text-xs sm:text-sm leading-tight line-clamp-2">
                          {video.name}
                        </h4>
                        <div className="flex items-center space-x-1 sm:space-x-2 mt-1">
                          {video.category && (
                            <span className="inline-flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                              {getCategoryIcon(video.category)}
                              <span className="hidden xs:inline">{video.category}</span>
                            </span>
                          )}
                          {video.duration && (
                            <span className="text-xs text-gray-500 flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{video.duration}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredVideos.length === 0 && (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Search className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-300" />
                  <p className="text-sm sm:text-base">No videos found matching your search.</p>
                  <p className="text-xs sm:text-sm mt-1">Try adjusting your search terms or filters.</p>
                </div>
              )}

              {/* Load More Button */}
              {hasMoreVideos && (
                <div className="pt-3 sm:pt-4 border-t border-gray-200 mt-3 sm:mt-4">
                  <button
                    onClick={loadMoreVideos}
                    className="w-full py-2 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200"
                  >
                    Load More Videos ({filteredVideos.length - visibleVideos.length} remaining)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusVideosPage;