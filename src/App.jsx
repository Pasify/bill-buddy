import { useState } from "react";
import initialFriends from "./App";
export default function App() {
  const Friends = initialFriends;
  //show friend
  const [showAddFriend, setShowAddFriend] = useState(false);
  //handle Show add friend
  function handleShowAddFriend() {
    setShowAddFriend((showAddFriend) => !showAddFriend);
  }

  const [initfriends, setInitFriends] = useState(Friends);
  // option1
  // function handleAddFriend(friend) {
  //   setInitFriends((initfriends) => [...initfriends, friend]);
  // }
  //set name
  const [name, setName] = useState("");
  function nameUpdater(e) {
    setName((n) => e.target.value);
  }

  //set image
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function imageUpdater(e) {
    setImage((i) => e.target.value);
  }

  // selected friend
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((selectedFriend) =>
      selectedFriend?.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  }

  // handle Submit on form
  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    // option 1
    // handleAddFriend(newFriend);

    // option 2
    setInitFriends((initfriends) => [...initfriends, newFriend]);
    setName("");
    setImage("https://i.pravatar.cc/48");
    setShowAddFriend(false);
  }

  //handle split bill
  function handleSplitBill(val) {
    console.log(val);
    setInitFriends((initfriends) =>
      initfriends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...initfriends, balance: friend.balance + val }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          initialFriends={initfriends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && (
          <FormAddFriend
            friendName={name}
            updateName={nameUpdater}
            friendImage={image}
            updateImage={imageUpdater}
            handleSubmit={handleSubmit}
          />
        )}
        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? `Close` : `Add Friend`}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selected={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ initialFriends, onSelection, selectedFriend }) {
  return (
    <ul>
      {initialFriends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  function selection() {
    onSelection(friend);
  }
  return (
    <li className={isSelected ? `selected` : ``}>
      <img src={friend.image} alt={`${friend.name} picture`} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}

      <Button onClick={selection}>{isSelected ? `close` : `select`}</Button>
    </li>
  );
}

function FormAddFriend({
  friendName,
  updateName,
  friendImage,
  updateImage,
  handleSubmit,
}) {
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label htmlFor="">👫Friend Name</label>
      <input type="text" value={friendName} onChange={updateName} />
      <label htmlFor="">🖼Image URL</label>
      <input type="text" value={friendImage} onChange={updateImage} />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selected, onSplitBill }) {
  const [billValue, setBillValue] = useState("");
  const [expenseValue, setExpenseValue] = useState("");

  const paidByFriend = billValue ? billValue - expenseValue : "";
  const [whoIspaying, setWhoIsPaying] = useState("user");

  function billSetter(e) {
    setBillValue((billValue) => +e.target.value);
  }
  function expenseSetter(e) {
    setExpenseValue((expenseValue) =>
      +e.target.value > billValue ? expenseValue : +e.target.value
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!billValue || !expenseValue) return;
    onSplitBill(whoIspaying === `user` ? paidByFriend : -expenseValue);
  }

  return (
    <form action="" className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split bill with {selected.name}</h2>
      <label htmlFor="">💲 Bill Value</label>
      <input type="text" value={billValue} onChange={billSetter} />
      <label htmlFor="">🙎🏼‍♂️ Your Expense</label>
      <input type="text" value={expenseValue} onChange={expenseSetter} />
      <label htmlFor="">🤵🏼 {selected.name}'s Expense</label>
      <input type="text" disabled value={paidByFriend} />
      <label htmlFor="">🤑Who is paying The bill</label>
      <select
        name=""
        id=""
        value={whoIspaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selected.name}</option>
      </select>

      <Button>Split</Button>
    </form>
  );
}
