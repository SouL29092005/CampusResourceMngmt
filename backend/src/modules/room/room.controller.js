import Room from "./room.model.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";


export const addRoom = async (req, res, next) => {
  try {
    const {
      roomId,
      location,
      roomType,
      capacity,
      facilities,
      department
    } = req.body;

    if (!roomId || location === undefined || !roomType || !capacity) {
      return next(new ApiError(400, "Missing required room fields"));
    }

    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return next(new ApiError(409, "Room with this roomId already exists"));
    }

    const room = await Room.create({
      roomId,
      location,
      roomType,
      capacity,
      facilities,
      department
    });

    return res
      .status(201)
      .json(new ApiResponse(201, room, "Room added successfully"));
  } catch (error) {
    next(error);
  }
};

export const deactivateRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId, isActive: true });
    if (!room) {
      return next(new ApiError(404, "Room not found or already inactive"));
    }

    room.isActive = false;
    await room.save();

    return res
      .status(200)
      .json(new ApiResponse(200, room, "Room soft-deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const deactivateRoomBooking = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId, isActive: true });
    if (!room) {
      return next(new ApiError(404, "Room not found"));
    }

    room.isBookable = false;
    await room.save();

    return res
      .status(200)
      .json(new ApiResponse(200, room, "Room booking deactivated"));
  } catch (error) {
    next(error);
  }
};


export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();

    return res
      .status(200)
      .json(new ApiResponse(200, rooms, "Active rooms fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId, isActive: true });
    if (!room) {
      return next(new ApiError(404, "Room not found"));
    }

    const {
      location,
      roomType,
      capacity,
      facilities,
      department,
      isBookable
    } = req.body;

    if (location !== undefined) room.location = location;
    if (roomType !== undefined) room.roomType = roomType;
    if (capacity !== undefined) room.capacity = capacity;
    if (facilities !== undefined) room.facilities = facilities;
    if (department !== undefined) room.department = department;
    if (isBookable !== undefined) room.isBookable = isBookable;

    await room.save();

    return res
      .status(200)
      .json(new ApiResponse(200, room, "Room updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId, isActive: true });
    if (!room) {
      return next(new ApiError(404, "Room not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, room, "Room fetched successfully"));
  } catch (error) {
    next(error);
  }
};

export const reactivateRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return next(new ApiError(404, "Room not found"));
    }

    if (room.isActive === true) {
      return next(new ApiError(400, "Room is already active"));
    }

    room.isActive = true;
    await room.save();

    return res
      .status(200)
      .json(new ApiResponse(200, room, "Room reactivated successfully"));
  } catch (error) {
    next(error);
  }
};

export const reactivateRoomBooking = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId, isActive: true });
    if (!room) {
      return next(new ApiError(404, "Room not found or inactive"));
    }

    if (room.isBookable === true) {
      return next(new ApiError(400, "Room booking is already active"));
    }

    room.isBookable = true;
    await room.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, room, "Room booking reactivated successfully")
      );
  } catch (error) {
    next(error);
  }
};
