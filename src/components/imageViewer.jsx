const ImageViewer = ({ imageUrl }) => {
  return (
    <div className='h-auto w-full flex justify-center items-center '>
      <img
        src={imageUrl}
        alt='Dataset'
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  );
};

export default ImageViewer;
