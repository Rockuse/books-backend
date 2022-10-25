/* eslint-disable eqeqeq */
/* eslint-disable max-len */
const { nanoid } = require('nanoid');
const books = require('./books');
const { pickKeys, throwError, isSuccess } = require('./utility');

async function addBookHandler(req, h) {
  try {
    const body = req.payload;
    // Kondisi gagal
    if (typeof body.name === 'undefined' || !body.name.trim().length) return h.response({ status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku' }).code(400);
    if (body.readPage > body.pageCount) return h.response({ status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' }).code(400);

    // Kondisi Sukses
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = body.pageCount === body.readPage;
    const newBook = {
      id, ...body, finished, insertedAt, updatedAt,
    };
    books.push(newBook);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } catch (err) {
    return throwError(h);
  }
}

async function listBookHandler(req, h) {
  try {
    const { reading, finished, name } = req.query;
    // reading
    if (reading !== undefined) {
      const book = await books.filter((item) => (item.reading == (reading == '1')));
      const listBook = book.map(pickKeys);
      const response = h.response({
        status: 'success',
        data: {
          books: listBook,
        },
      });
      return response;
    }
    // finished
    if (finished !== undefined) {
      const book = books.filter((item) => item.finished == finished);
      const listBook = book.map(pickKeys);
      const response = h.response({
        status: 'success',
        data: {
          books: listBook,
        },
      });
      return response;
    }
    // name
    if (name !== undefined) {
      const book = books.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
      const listBook = await book.map(pickKeys);
      const response = h.response({
        status: 'success',
        data: {
          books: listBook,
        },
      });
      return response;
    }
    // Return All
    const listBook = await books.map(pickKeys);
    const response = h.response({
      status: 'success',
      data: {
        books: listBook,
      },
    });
    return response;
  } catch (err) {
    return throwError(h);
  }
}

async function getOneBookHandler(req, h) {
  try {
    const { bookId } = req.params;
    const book = await books.filter((item) => item.id === bookId)[0]; // return array apabila tidak menggunakan [0]
    if (book === undefined) return h.response({ status: 'fail', message: 'Buku tidak ditemukan' }).code(404);
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    return response;
  } catch (err) {
    return throwError(h);
  }
}

async function updateBookHandler(req, h) {
  try {
    const { bookId } = req.params;
    const body = req.payload;
    const updateAt = new Date().toISOString();
    const index = await books.findIndex((item) => item.id === bookId);
    // Kondisi gagal
    if (typeof body.name === 'undefined' || !body.name.trim().length) return h.response({ status: 'fail', message: 'Gagal memperbarui buku. Mohon isi nama buku' }).code(400);
    if (body.readPage > body.pageCount) return h.response({ status: 'fail', message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount' }).code(400);
    if (index === -1) return h.response({ status: 'fail', message: 'Gagal memperbarui buku. Id tidak ditemukan' }).code(404);
    books[index] = {
      ...books[index], ...body, updateAt,
    };

    return isSuccess(h, 'diperbarui');
  } catch (err) {
    return throwError(h);
  }
}

async function deleteBookHandler(req, h) {
  try {
    const { bookId } = req.params;
    const index = await books.findIndex((item) => item.id === bookId); // return array apabila tidak menggunakan [0]
    if (index === -1) return h.response({ status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan' }).code(404);
    books.splice(index, 1);
    return isSuccess(h, 'dihapus');
  } catch (err) {
    return throwError(h);
  }
}
module.exports = {
  addBookHandler, listBookHandler, getOneBookHandler, updateBookHandler, deleteBookHandler,
};

// try {
// } catch (err) {
//   return h.response({
//     status: 'error',
//     message: 'Buku gagal ditambahkan',
//   }).code(500);
// }
