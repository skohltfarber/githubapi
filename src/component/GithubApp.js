import React, { useState } from 'react';
import './GithubApp.scss';
import MyPieChart from './MyPieChart';
import Button from '@material-ui/core/Button';
import Avatar from './Avatar';

const GithubApp = () => {
    const [username, setUsername] = useState("");
    const [languages, setLanguages] = useState([]);
    const [fetching, setFetching] = useState(false);
    const [errormsg, setErrormsg] = useState("");
    const [userfullname, setUserfullname] = useState("");
    const [avatarsrc, setAvatarsrc] = useState("");
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);

    const myHeaders = new Headers();
    const authHeader = "Basic " + btoa(process.env.REACT_APP_GITHUB_CLIENT_ID + ":" + process.env.REACT_APP_GITHUB_CLIENT_SECRET);
    myHeaders.append("Authorization", authHeader);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const handleChange = (event) => {
        setUsername(event.target.value);
    }

    const fetchUser = async () => {
        setFetching(true);

        // Remove all the entries from the Array. 
        clearUserdetails();

        const resp = await fetch(`https://api.github.com/users/${username}`, requestOptions);
        const user = await resp.json();
        if (user.name === undefined || user.name === null) {
            setErrormsg("Not a valid user");
            console.log("Cleared out Lanuages.");

        } else {
            setUserfullname(user.name);
            setAvatarsrc(user.avatar_url);
            setFollowers(user.followers);
            setFollowing(user.following);
            console.log(user.name);

            fetchUserdetails();
        }

        setFetching(false);
    }

    const fetchUserdetails = async () => {
        setFetching(true);
        const resp = await fetch(`https://api.github.com/users/${username}/repos`, requestOptions);
        const userRepositories = await resp.json();
        if (userRepositories && userRepositories.length > 0) {
            const languageMap = new Map();
            userRepositories.forEach((repo) => {
                if (repo.language) {
                    if (languageMap.has(repo.language)) {
                        languageMap.set(repo.language, languageMap.get(repo.language) + 1);
                    } else {
                        languageMap.set(repo.language, 1);
                    }
                }
            });
            setLanguages([]);
            const l = [];
            l.push(["Languages", "Count"]);
            languageMap.forEach((value, key) => {
                l.push([key, value]);

            });
            setLanguages(languages => l);
        } else {
            setErrormsg("Not a valid user");
        }
        setFetching(false);
    }

    const clearUserdetails = async () => {
        setFetching(true);
        setLanguages([]);
        setFetching(false);
    }

    return (
        <div className="container">
            <h3>What programming language do they code on Github?</h3>
            <p>(based on user's contributions)</p>
            <input
                type="text"
                placeholder="Enter User's Github username"
                value={username}
                onChange={handleChange}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={fetchUser}
            >
                Fetch
            </Button>
            <div>
                {errormsg}
            </div>
            <div>
                {languages.length > 0 && !fetching
                    &&
                    <div>
                        <div>
                            {
                                avatarsrc &&
                                <Avatar src={avatarsrc} />
                            }
                            {
                                userfullname &&
                                <span><br />{userfullname}</span>
                            }
                            {
                                followers &&
                                <p>Followers: {followers}</p>
                            }
                            {
                                following &&
                                <p>Following {following}</p>
                            }
                        </div>
                        <MyPieChart languages={languages} userfullname={userfullname} />
                    </div>
                }
            </div>

        </div>
    )
};

export default GithubApp;
