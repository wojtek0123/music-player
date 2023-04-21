import { useEffect } from "react";
import Navigation from "../components/Navigation";
import styles from "../styles/Home.module.css";
import { useDispatch } from "react-redux";
import { supabase } from "../helpers/supabase";
import { setSession } from "../features/auth/authSlice";
import Section from "../components/Section";
import { Song } from "../helpers/types";

const songs: Song[] = [
  {
    id: "1",
    title: "Lofi Chill",
    author: "FASSounds",
    length: 124,
    link: "https://ptjdojdwwccirjiuvuut.supabase.co/storage/v1/object/sign/songs/lofi-chill-140858.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9sb2ZpLWNoaWxsLTE0MDg1OC5tcDMiLCJpYXQiOjE2ODA1MTUyNDAsImV4cCI6MTcxMjA1MTI0MH0.JAeXb0lIvDWisIhaVJmtAN6qUyj-oN5WhVC8iyFrDyA&t=2023-04-03T09%3A47%3A08.395Z",
  },
  {
    id: "2",
    title: "Lofi Chill",
    author: "FASSounds",
    length: 124,
    link: "https://ptjdojdwwccirjiuvuut.supabase.co/storage/v1/object/sign/songs/lofi-chill-140858.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9sb2ZpLWNoaWxsLTE0MDg1OC5tcDMiLCJpYXQiOjE2ODA1MTUyNDAsImV4cCI6MTcxMjA1MTI0MH0.JAeXb0lIvDWisIhaVJmtAN6qUyj-oN5WhVC8iyFrDyA&t=2023-04-03T09%3A47%3A08.395Z",
  },
  {
    id: "3",
    title: "Jakiś randomowy długi tytuł",
    author: "FASSounds",
    length: 124,
    link: "https://ptjdojdwwccirjiuvuut.supabase.co/storage/v1/object/sign/songs/lofi-chill-140858.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9sb2ZpLWNoaWxsLTE0MDg1OC5tcDMiLCJpYXQiOjE2ODA1MTUyNDAsImV4cCI6MTcxMjA1MTI0MH0.JAeXb0lIvDWisIhaVJmtAN6qUyj-oN5WhVC8iyFrDyA&t=2023-04-03T09%3A47%3A08.395Z",
  },
  {
    id: "4",
    title: "Lofi Chill",
    author: "FASSounds",
    length: 124,
    link: "https://ptjdojdwwccirjiuvuut.supabase.co/storage/v1/object/sign/songs/lofi-chill-140858.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9sb2ZpLWNoaWxsLTE0MDg1OC5tcDMiLCJpYXQiOjE2ODA1MTUyNDAsImV4cCI6MTcxMjA1MTI0MH0.JAeXb0lIvDWisIhaVJmtAN6qUyj-oN5WhVC8iyFrDyA&t=2023-04-03T09%3A47%3A08.395Z",
  },
  {
    id: "5",
    title: "Lofi Chill",
    author: "FASSounds",
    length: 124,
    link: "https://ptjdojdwwccirjiuvuut.supabase.co/storage/v1/object/sign/songs/lofi-chill-140858.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9sb2ZpLWNoaWxsLTE0MDg1OC5tcDMiLCJpYXQiOjE2ODA1MTUyNDAsImV4cCI6MTcxMjA1MTI0MH0.JAeXb0lIvDWisIhaVJmtAN6qUyj-oN5WhVC8iyFrDyA&t=2023-04-03T09%3A47%3A08.395Z",
  },
  {
    id: "6",
    title: "Lofi Chill",
    author: "FASSounds",
    length: 124,
    link: "https://ptjdojdwwccirjiuvuut.supabase.co/storage/v1/object/sign/songs/lofi-chill-140858.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9sb2ZpLWNoaWxsLTE0MDg1OC5tcDMiLCJpYXQiOjE2ODA1MTUyNDAsImV4cCI6MTcxMjA1MTI0MH0.JAeXb0lIvDWisIhaVJmtAN6qUyj-oN5WhVC8iyFrDyA&t=2023-04-03T09%3A47%3A08.395Z",
  },
  {
    id: "7",
    title: "Lofi Chill",
    author: "FASSounds",
    length: 124,
    link: "https://ptjdojdwwccirjiuvuut.supabase.co/storage/v1/object/sign/songs/lofi-chill-140858.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9sb2ZpLWNoaWxsLTE0MDg1OC5tcDMiLCJpYXQiOjE2ODA1MTUyNDAsImV4cCI6MTcxMjA1MTI0MH0.JAeXb0lIvDWisIhaVJmtAN6qUyj-oN5WhVC8iyFrDyA&t=2023-04-03T09%3A47%3A08.395Z",
  },
  {
    id: "8",
    title: "Lofi Chill",
    author: "FASSounds",
    length: 124,
    link: "https://ptjdojdwwccirjiuvuut.supabase.co/storage/v1/object/sign/songs/lofi-chill-140858.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9sb2ZpLWNoaWxsLTE0MDg1OC5tcDMiLCJpYXQiOjE2ODA1MTUyNDAsImV4cCI6MTcxMjA1MTI0MH0.JAeXb0lIvDWisIhaVJmtAN6qUyj-oN5WhVC8iyFrDyA&t=2023-04-03T09%3A47%3A08.395Z",
  },
  {
    id: "9",
    title: "Lofi Chill",
    author: "FASSounds",
    length: 124,
    link: "https://ptjdojdwwccirjiuvuut.supabase.co/storage/v1/object/sign/songs/lofi-chill-140858.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9sb2ZpLWNoaWxsLTE0MDg1OC5tcDMiLCJpYXQiOjE2ODA1MTUyNDAsImV4cCI6MTcxMjA1MTI0MH0.JAeXb0lIvDWisIhaVJmtAN6qUyj-oN5WhVC8iyFrDyA&t=2023-04-03T09%3A47%3A08.395Z",
  },
  {
    id: "10",
    title: "Lofi Chill",
    author: "FASSounds",
    length: 124,
    link: "https://ptjdojdwwccirjiuvuut.supabase.co/storage/v1/object/sign/songs/lofi-chill-140858.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9sb2ZpLWNoaWxsLTE0MDg1OC5tcDMiLCJpYXQiOjE2ODA1MTUyNDAsImV4cCI6MTcxMjA1MTI0MH0.JAeXb0lIvDWisIhaVJmtAN6qUyj-oN5WhVC8iyFrDyA&t=2023-04-03T09%3A47%3A08.395Z",
  },
  {
    id: "11",
    title: "Lofi Chill",
    author: "FASSounds",
    length: 124,
    link: "https://ptjdojdwwccirjiuvuut.supabase.co/storage/v1/object/sign/songs/lofi-chill-140858.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9sb2ZpLWNoaWxsLTE0MDg1OC5tcDMiLCJpYXQiOjE2ODA1MTUyNDAsImV4cCI6MTcxMjA1MTI0MH0.JAeXb0lIvDWisIhaVJmtAN6qUyj-oN5WhVC8iyFrDyA&t=2023-04-03T09%3A47%3A08.395Z",
  },
  {
    id: "12",
    title: "Lofi Chill",
    author: "FASSounds",
    length: 124,
    link: "https://ptjdojdwwccirjiuvuut.supabase.co/storage/v1/object/sign/songs/lofi-chill-140858.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJzb25ncy9sb2ZpLWNoaWxsLTE0MDg1OC5tcDMiLCJpYXQiOjE2ODA1MTUyNDAsImV4cCI6MTcxMjA1MTI0MH0.JAeXb0lIvDWisIhaVJmtAN6qUyj-oN5WhVC8iyFrDyA&t=2023-04-03T09%3A47%3A08.395Z",
  },
];

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      dispatch(setSession(session));
    })();
  }, [dispatch]);
  
  return <>
    <Navigation></Navigation>
    <div className={styles.container}>
      <Section songs={songs} header="Trending" />
      <Section songs={songs} header="Most popular" />
      <Section songs={songs} header="For you" />
    </div>
  </>
};

export default HomePage;
