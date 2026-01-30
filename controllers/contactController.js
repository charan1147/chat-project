export const getContacts = async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "contacts",
    "name email",
  );
  res.json({ contacts: user.contacts || [] });
};
