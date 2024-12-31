export interface Phrase {
  id?: number;
  _id: string;
  meaning: string;
  phrase: string;
  pronounciation?: string;
  translation?: string;
  bookId: string;
  groupId?: string;
  createdAt: Date;
  updatedAt: Date;
  hidden?: boolean;
  importedAt?: Date;
}

export interface Book {
  id?: number;
  _id: string;
  name: string;
  voice?: string;
  createdAt: Date;
  updatedAt: Date;
  importedAt?: Date;
}

export interface Group {
  id?: number;
  _id: string;
  bookId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  importedAt?: Date;
  open?: boolean;
}

export type LibraryData = {
  _id: string;
  book: Book;
  phrases: Phrase[];
  groups: Group[];
  exportedAt: Date;
};

export async function getLibrary(path: string) {
  try {
    const library = [];

    for await (const dirEntry of Deno.readDir(path)) {
      if (!dirEntry.isFile) {
        continue;
      }

      if (!dirEntry.name.endsWith('.book.json.txt')) {
        continue;
      }

      const file = await Deno.readTextFile(`${path}/${dirEntry.name}`);
      const book = JSON.parse(file) as LibraryData;

      library.push(book);
    }

    return Promise.resolve(library);
  } catch (e) {
    console.error(e);

    return Promise.resolve([]);
  }
}
