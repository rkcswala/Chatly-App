import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import genToken from "../config/token.js";
import uploadclounary from "../config/cloudnary.js"

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields!"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters!"
      });
    }

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = genToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
      path: "/",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.log("Signup Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error!"
    });
  }
};
// login controller.................



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all the fields!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }


    const token = await genToken(user._id);


    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: false,
    });


    const userData = await User.findById(user._id).select(
      "-password"
    );

    return res.status(200).json({
      message: "User logged in successfully",
      user: userData,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);

    return res.status(500).json({
      message: "Server error!",
      error: error.message,
    });
  }
};


// logout controller.................
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });

    return res.status(200).json({
      message: "Logout successful",
    });

  } catch (error) {
    console.log("Logout error:", error);

    return res.status(500).json({
      message: "Logout failed",
    });
  }
};



// all users find karna 


export const getallusers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found"
      });
    }

    return res.status(200).json({
      message: "All users fetched successfully",
      users
    });

  } catch (error) {

    return res.status(500).json({
      message: "Get all users error",

    });
  }
}


// current user controller 




export const getcurrentuser = async (req, res) => {
  try {

    if (!req.userId) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Current user fetched successfully",
      user: user,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Current user error",

    });
  }
};



// profile update controller




export const editProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { name, email } = req.body;

    const updateData = {};

    if (name?.trim()) {
      updateData.name = name.trim();
    }

    if (email?.trim()) {
      updateData.email = email.trim();
    }

    // Image selected hai to image bhi update karo
    if (req.file) {
      const image = await uploadclounary(req.file.path);

      if (!image?.secure_url) {
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }

      updateData.image = image.secure_url;
    }


    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).select("-password");


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Profile update failed",
    });
  }
};


