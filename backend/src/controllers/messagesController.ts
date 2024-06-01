import { Request, Response, NextFunction } from "express";
import messageModel from "../model/messageModel";

export const addMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) {
      return res.status(200).json({ msg: "Message added successfully." });
    } else {
      return res.status(500).json({ msg: "Failed to add message to the database." });
    }
  } catch (ex) {
    next(ex);
  }
};

export const getAllMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: {
          $all: [from, to],
        },
      })
      .sort({ updatedAt: 1 });

    const projectMessages = messages.map((msg: any) => ({
      fromSelf: msg.sender.toString() === from,
      message: msg.message?.text || "",
    }));

    return res.status(200).json(projectMessages);
  } catch (error) {
    next(error);
  }
};
