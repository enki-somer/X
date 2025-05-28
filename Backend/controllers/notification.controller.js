import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profilePic",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json({ notifications });
  } catch (error) {
    console.log("Error in getNotifications : ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotifications : ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//DELETE NOTIFICATION SINGULAR

// export const deleteNotification = async (req, res) => {
//   try {
//     const notification = req.params.id;

//     await Notification.findByIdAndDelete(notification);

//     if (!notification) {
//       return res.status(404).json({ message: "Notification not found" });
//     }

//     if (notification.to.toString() !== userId.toString()) {
//       return res
//         .status(403)
//         .json({
//           message: "You are not authorized to delete this notification",
//         });
//     }

//     await Notification.findByIdAndDelete(notification);
//     res.status(200).json({ message: "Notification deleted successfully" });
//   } catch (error) {
//     console.log("Error in deleteNotification : ", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
