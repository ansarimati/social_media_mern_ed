import User from "../Models/User.js";

// get user info

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;  
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}


// get user friends list

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user  = await User.findById(id);
        console.log("userFriends", user.friends);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id) )
        );
        
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        )

        res.status(200).json(formattedFriends);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}


// add or remove friends 

export const addRemoveFriends = async (req, res) => {
    try {
        const { id, friendId } = req.params;   
        const user = await User.findById(id);
        const frined = await User.findById(friendId);

        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            frined.friends = frined.friends.filter((id) => id !== id )
        } else {
            user.friends.push(friendId);
            frined.friends.push(id);
        }

        await user.save();
        await frined.save();

        // get new frined list

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id) )
        )
        
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath }
            }
        )

        res.status(200).json(formattedFriends);

    } catch (err) { 
        res.status(404).json({ message: err.message });
    }
}


