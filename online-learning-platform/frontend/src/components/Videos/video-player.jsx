const VideoPlayer = ({ videoSourceUrl }) => {
  return (
    <div className="w-full px-5 pb-8 rounded-md overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          className="w-full md:h-[480px] h-[240px] rounded-md shadow-2xl aspect-video"
          src={videoSourceUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPlayer;
