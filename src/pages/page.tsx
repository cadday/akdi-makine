import { LINKS } from "@/constants";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(LINKS.home);
  });
  return <></>;
}
