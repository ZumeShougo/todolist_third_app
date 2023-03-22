import { useEffect, useState } from 'react';
import { db } from "./firebase";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore";
import './App.css';

interface Todo{
  id: string;
  title: string;
  discription: string;
  status: string;
}

function App(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectFilter, setSelectFilter] = useState<string>('未着手');

  useEffect(() => {
    const todosCollectionRef = collection(db, 'todos');
    const q = query(todosCollectionRef, orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setTodos(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Todo))
      );
    });
    return unsub;
  }, []);

  useEffect(() => {
    setEditingTodo(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { title, discription, status } = e.currentTarget.elements as unknown as {
      title: { value: string };
      discription: { value: string };
      status: { value: string };
    };
    if (isEditing && editingTodo) {
      const todosCollectionRef = doc(db, 'todos', editingTodo.id);
      await updateDoc(todosCollectionRef, {
        title: title.value,
        discription: discription.value,
        status: status.value,
      });
      setIsEditing(false);
      setEditingTodo(null);
    } else {
      const todosCollectionRef = collection(db, 'todos');
      await addDoc(todosCollectionRef, {
        title: title.value,
        discription: discription.value,
        status: '未着手',
        timestamp: serverTimestamp(),
      });
    }
    title.value = '';
    discription.value = '';
  };

  const handleDelete = async (id: string) => {
    const todoDocumentRef = doc(db, 'todos', id);
    await deleteDoc(todoDocumentRef);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectFilter(e.target.value);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-4 bg-white rounded-md shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
            タイトル
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="タイトルを入力"
            className="appearance-none border rounded-md py-2 px-3 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="discription" className="block text-gray-700 font-bold mb-2">
            詳細
          </label>
          <input
            id="discription"
            name="discription"
            type="text"
            placeholder="詳細を入力"
            className="appearance-none border rounded-md py-2 px-3 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className={`${
            isEditing ? "bg-yellow-500 hover:bg-yellow-700" : "bg-blue-500 hover:bg-blue-700" }  text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`
          }
        >
          {isEditing ? "更新" : "保存"}
        </button>
      </form>
      <h1 className="text-2xl font-bold mt-8">TODOリスト</h1>
      <select className="block w-full max-w-sm py-2 px-3 mt-4 bg-white border border-gray-400 rounded-md shadow-md focus:outline-none focus:shadow-outline-blue" onChange={(e) => handleChangeFilter(e)}>
        <option value='未着手'>未着手</option>
        <option value='着手中'>着手中</option>
        <option value='完了'>完了</option>
      </select>
      <div className="w-full max-w-md mt-4">
        {todos.filter(todo => todo.status === selectFilter).map(todo =>
          <div
            key={todo.id}
            className="bg-white rounded-md shadow-md p-4 mb-4 border-t-4 border-blue-500"
          >
            <p
              className={`font-bold text-center ${
              todo.status === "未着手"
                ? "text-red-500"
                : todo.status === "着手中"
                ? "text-green-500"
                : "text-blue-500"
                }`}
                >{todo.status}
            </p>
            <h2 className="text-lg font-bold mb-2">{todo.title}</h2>
            <p className="text-gray-700">{todo.discription}</p>
            <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4  rounded focus:outline-none focus:shadow-outline' onClick={() => handleDelete(todo.id)}>削除</button>
            <button className='bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' onClick={() => handleEdit(todo)}>編集</button>
        </div>
          )}
      </div>
      {isEditing && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-md p-4">
            <h2 className="text-lg font-bold mb-2">タスクの編集</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                  タイトル
                </label>
                {editingTodo && (
                  <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="タイトルを入力"
                  defaultValue={editingTodo.title}
                  className="appearance-none border rounded-md py-2 px-3 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="discription" className="block text-gray-700 font-bold mb-2">
                  詳細
                </label>
                {editingTodo && (
                  <input
                  id="discription"
                  name="discription"
                  type="text"
                  placeholder="詳細を入力"
                  defaultValue={editingTodo.discription}
                  className="appearance-none border rounded-md py-2 px-3 w-full text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                )}
              </div>
              <div className='mb-4'>
                <label htmlFor='status' className='block text-gray font-bold mb-2'>
                  ステータス
                </label>
                {editingTodo && (
                  <select id='status' name='status'  defaultValue={editingTodo.status}>
                  <option value='未着手'>未着手</option>
                  <option value='着手中'>着手中</option>
                  <option value='完了'>完了</option>
                </select>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleEditCancel}
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );


};

export default App;
