import User from "../models/User.js";

export const addContact = async (req, res) => {
  const { email } = req.body;

  const contact = await User.findOne({ email });
  if (!contact) return res.status(404).json({ message: "User not found" });
  if (contact._id.equals(req.user._id))
    return res.status(400).json({ message: "Cannot add yourself" });

  await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { contacts: contact._id },
  });

  await User.findByIdAndUpdate(contact._id, {
    $addToSet: { contacts: req.user._id },
  });

  res.json({ success: true });
};

export const getContacts = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "contacts",
    "name email",
  );
  res.json({ contacts: user.contacts || [] });
};
