const User = require('../Models/userModel');
const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


exports.addImage = async (req, res) => {
  try {
    const userId = req.params.id.trim();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ error: 'Invalid user ID format' });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'No photo uploaded' });
    }

    const imageUrl = req.file.path;

    const updatedUser = await exports.updateUserPhoto(
      userId,
      imageUrl,
    );

    res.status(200).json({
      message: 'Photo uploaded successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Photo upload failed' });
  }
};

exports.updateUserPhoto = async (userId, imageUrl) => {
  try {

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: imageUrl },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    console.error(
      'Error updating user photo:',
      error.message,
    );
    throw error;
  }
};

const escapeHtml = (str) => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const restrictedFields = ['password', '_id', 'createdAt', 'isAdmin', 'role'];
    restrictedFields.forEach(field => delete updateData[field]);

    if (updateData.email && !validator.isEmail(updateData.email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }



    if (updateData.age < 0) {
      return res.status(400).json({ error: 'Invalid age' });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    console.error('Error updating user:', error.message);
    res
      .status(500)
      .send('Server error: ' + escapeHtml(error.message));
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json({
      message: 'Users retrieved successfully',
      users,
    });
  } catch (error) {
    console.error('Error retrieving users:', error.message);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
}


exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    await Promise.all([
      mongoose.model('Course').deleteMany({ instructorId: userId }),
      mongoose.model('blog').deleteMany({ author: userId }),
      mongoose.model('Testimonial').deleteMany({ userId }),
    ]);

    res.status(200).json({
      message: 'User and associated data deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};


exports.getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }).select('-password');

    if (!instructors || instructors.length === 0) {
      return res.status(404).json({ message: 'No instructors found' });
    }

    res.status(200).json({
      message: 'Instructors retrieved successfully',
      instructors,
    });
  } catch (error) {
    console.error('Error retrieving instructors:', error.message);
    res.status(500).json({ error: 'Failed to retrieve instructors' });
  }
}


exports.getStudents = async (req, res) => {
  try {
    console.log('Fetching students...');
    const students = await User.find({ role: 'student' }).select('-password');

    if (!students || students.length === 0) {
      return res.status(404).json({ message: 'No students found' });
    }

    res.status(200).json({
      message: 'Students retrieved successfully',
      students,
    });
  } catch (error) {
    console.error('Error retrieving students:', error.message);
    res.status(500).json({ error: 'Failed to retrieve students' });
  }
}



exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (error) {
    console.error('Error retrieving user:', error.message);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
}




exports.addRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role, isAdmin } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        role,
        isAdmin,
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Role added successfully',
      user: updatedUser,
    });
  }
  catch (error) {
    console.error('Error adding role:', error.message);
    res.status(500).json({ error: 'Failed to add role' });
  }
}




exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old and new passwords are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ status: "sucess", message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error.message);
    res.status(500).json({ error: 'Failed to update password' });
  }
};


exports.checkPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ success: false, message: 'Incorrect password' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};



exports.checkAuth = async (req, res) => {
  try {


    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User authenticated successfully',
      user,
    });
  } catch (error) {
    console.error('Error authenticating user:', error.message);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
};
