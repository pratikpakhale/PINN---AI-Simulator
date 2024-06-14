const ImageViewer = ({ imageUrl }) => {
  return (
    <div className='h-full w-full flex justify-center '>
      <img
        src={imageUrl}
        alt='Dataset'
        style={{ maxWidth: '80%', maxHeight: '80%' }}
      />
    </div>
  );
};

export default ImageViewer;
