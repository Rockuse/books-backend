// Mapping object
function pickKeys(objects) {
  return {
    id: objects.id,
    name: objects.name,
    publisher: objects.publisher,
  };
}

// Generic Error
function throwError(h) {
  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
}

// Generic Error
function isSuccess(h, message, code = 200) {
  return h.response({
    status: 'success',
    message: `Buku berhasil ${message}`,
  }).code(code);
}
module.exports = { pickKeys, throwError, isSuccess };
