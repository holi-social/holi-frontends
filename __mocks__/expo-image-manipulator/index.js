const manipulateAsync = jest.fn().mockResolvedValue({
  uri: 'mock-uri',
  width: 100,
  height: 100,
});

module.exports = {
  manipulateAsync,
  SaveFormat: {
    JPEG: 'jpeg',
    PNG: 'png',
  },
}; 