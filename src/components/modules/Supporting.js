import React, { Component } from 'react';
import styles from './Supporting.module.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProfilePic from '../profile/ProfilePic';
import { BsCurrencyDollar } from 'react-icons/bs'

const Profile = (props) => {
  return (
    <div className={styles.profile}>
      <div className={styles.circleImage}>
        <ProfilePic fileurl={props.profile.fileurl || "https://i.pravatar.cc"} />
      </div>
      <div>{props.profile.username}</div>
      <div className={styles.actions}>
        <BsCurrencyDollar />
        {props.randomAmount}
      </div>
    </div>
  );
};


export default class Supporting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profiles: [],
      totalAmount: 0, // State variable to keep track of the total amount.
      profileRandomAmounts: {}, // Store random amounts for each profile.
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:5000/supporter/')
      .then((response) => {
        this.setState({ profiles: response.data }, () => {
          this.generateRandomAmounts(); // Generate random amounts for each profile after fetching data.
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // deleteProfile(id) {
  //   axios.delete('http://localhost:5000/profile/' + id).then((response) => {
  //     console.log(response.data);
  //   });

  //   this.setState((prevState) => ({
  //     profiles: prevState.profiles.filter((el) => el.id !== id),
  //     totalAmount: prevState.totalAmount - prevState.profileRandomAmounts[id], // Subtract the deleted profile's random amount from the total.
  //   }));
  // }

  generateRandomAmounts = () => {
    const randomAmounts = {};
    this.state.profiles.forEach((profile) => {
      const randomAmountCents = Math.floor(Math.random() * 1000) + 1; // Generate random amount between 1 and 1000 cents ($10).
      const randomAmountDollars = (randomAmountCents / 100).toFixed(2); // Convert to dollars with 2 decimal places.
      randomAmounts[profile.id] = randomAmountDollars;
    });

    this.setState({
      profileRandomAmounts: randomAmounts,
      totalAmount: Object.values(randomAmounts).reduce((sum, amount) => sum + parseFloat(amount), 0),
    });
  };

  render() {
    return (
      <div className={styles.supporting}>
        <div className={styles.title}>Supporting</div>
        <div className={styles.profileList}>
          <table className="table">
            <tbody>
              {this.state.profiles.map((currentProfile) => (
                <Profile
                  profile={currentProfile}
                  key={currentProfile.id}
                  randomAmount={this.state.profileRandomAmounts[currentProfile.id]}
                />
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.totalAmount}>
          Total Amount: <BsCurrencyDollar /> {this.state.totalAmount.toFixed(2)}
        </div>
      </div>
    );
  }
}