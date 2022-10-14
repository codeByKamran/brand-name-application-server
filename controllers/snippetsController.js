import Snippet from "../models/snippetModal.js";
import User from "../models/auth/userModal.js";
import Label from "../models/labelModal.js";
import { getSnippetsByIds } from "../middlewares/snippets/getSnippetsByIds.js";

export const addSnippet = async (req, res) => {
  const userID = req.body.userID;
  const snippet = req.body.snippet;

  try {
    // add snippet to db
    const added = await Snippet.create(snippet);

    if (!added) {
      res.statusMessage = "Unable to post";
      return res.sendStatus(500);
    }

    // update snippet inside user
    const foundUser = await User.findById(userID).exec();
    if (!foundUser) {
      res.statusMessage = "Not Found";
      res.sendStatus(404);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { snippets: [...foundUser.snippets, added._doc._id] },
      {
        new: true,
      }
    ).exec();

    if (!updatedUser) {
      res.statusMessage = "Unable to update";
      res.sendStatus(500);
    }

    // update snippet inside label

    added.labels?.forEach(async ({ _id }) => {
      console.log("Updating label", _id);
      const foundLabel = await Label.findById(_id).exec();

      console.log({ foundLabel });

      if (!foundLabel) {
        res.statusMessage = "Label Not Found";
        res.sendStatus(404);
      }

      const updatedLabel = await Label.findByIdAndUpdate(
        _id, // label id
        { snippets: [...foundLabel?.snippets, added._doc._id] },
        {
          new: true,
        }
      ).exec();

      if (!updatedLabel) {
        res.statusMessage = "Unable to update label";
        res.sendStatus(500);
      }

      console.log("Updated label", _id);
    });

    // send success response to client
    res.statusMessage = "Added successfully";
    res.status(201).json({ added, updatedUser });
  } catch (err) {
    // catch and sent error to client
    res.statusMessage = err.message;
    console.log(err.message);
  }
};

export const getSnippets = async (req, res) => {
  try {
    const found = await Snippet.find().exec();
    if (!found) {
      res.statusMessage = "Nothing Found";
      return res.sendStatus(404);
    }
    res.statusMessage = "Data Found";
    res.status(200).json({ found });
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(500);
  }
};

export const getSnippetsByLabel = async (req, res) => {
  const labelID = req.params.labelID;

  try {
    // fetch label and all of its associated labels
    const labelFound = await Label.findById(labelID).exec();

    if (!labelFound) {
      // label not found in db
      res.statusMessage = "Label not found";
      return res.sendStatus(401);
    }

    const snippetIDs = labelFound?.snippets;

    const result = await Snippet.find({
      _id: { $in: snippetIDs },
    }).sort([["updatedAt", -1]]);

    if (!result) {
      res.statusMessage = "Nothing Found";
      return res.sendStatus(204);
    }
    res.statusMessage = "Data Found";
    res.status(200).json({ result });
  } catch (err) {
    res.statusMessage = err.message;
    return res.sendStatus(500);
  }
};

export const getManySnippets = async (req, res) => {
  const ids = req.body.ids;
  try {
    const result = await Snippet.find({
      _id: { $in: ids },
    }).sort([["updatedAt", -1]]);

    if (!result) {
      res.statusMessage = "Nothing Found";
      return res.sendStatus(204);
    }
    res.statusMessage = "Data Found";
    res.status(200).json({ result });
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(500);
  }
};

export const getSnippetById = async (req, res) => {
  const id = req.params.id;
  try {
    const found = await Snippet.findById(id).exec();
    if (!found) {
      res.statusMessage = "Data Not Found";
      return res.sendStatus(204);
    }

    res.statusMessage = "Data Found";
    res.status(200).json({ found });
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(500);
  }
};

export const updateSnippet = async (req, res) => {
  const id = req.params.id || req.body.id;
  let snippet = req.body.snippet;

  // deleting not to update props based on type of update
  !snippet?.labels && delete snippet.labels;
  !snippet?.tags && delete snippet.tags;

  try {
    const updated = await Snippet.findByIdAndUpdate(id, snippet, {
      new: true,
    }).exec();

    if (!updated) {
      res.statusMessage = "Not Found";
      return res.sendStatus(404);
    }
    res.statusMessage = "Updated";
    res.status(201).json({ updated });
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(500);
  }
};

export const deleteSnippet = async (req, res) => {
  const id = req.params.id.split("_")[0] || req.body.id;
  const userID = req.body.userID || req.params.id.split("_")[1];

  try {
    // find snippet in db
    const snippetFound = await Snippet.findById(id).exec();

    if (!snippetFound) {
      res.statusMessage = "Not Found";
      return res.sendStatus(404);
    }

    // delete snippet
    const deleted = await Snippet.findByIdAndDelete(id).exec();

    if (!deleted) {
      res.statusMessage = "Unable to delete";
      return res.sendStatus(500);
    }

    // update snippet inside user
    const foundUser = await User.findById(userID).exec();
    if (!foundUser) {
      res.statusMessage = "Not Found";
      res.sendStatus(404);
    }

    const newSnippets = foundUser?.snippets?.filter(
      (snippetID) => snippetID !== id
    );

    const updatedUser = await User.findByIdAndUpdate(
      userID,
      {
        snippets: newSnippets,
      },
      { new: true }
    ).exec();

    if (!updatedUser) {
      res.statusMessage = "Unable to delete";
      return res.sendStatus(500);
    }

    // update snippet inside label
    snippetFound.labels?.forEach(async ({ _id }) => {
      console.log("Updating label", _id);
      const foundLabel = await Label.findById(_id).exec();

      if (!foundLabel) {
        res.statusMessage = "Label Not Found";
        res.sendStatus(404);
      }

      const updatedLabel = await Label.findByIdAndUpdate(
        _id,
        { snippets: foundLabel.snippets?.filter((label) => label !== id) },
        {
          new: true,
        }
      ).exec();

      if (!updatedLabel) {
        res.statusMessage = "Unable to update label";
        res.sendStatus(500);
      }

      console.log("Updated label", _id);
    });

    res.statusMessage = "Deleted";
    res.status(200).json({ deleted, snippets: updatedUser?.snippets });
  } catch (err) {
    res.statusMessage = err.message;
    res.sendStatus(500);
  }
};
