import React, { useEffect } from "react";
import Container from './Container';

function Page({title, children, wide}) {
    useEffect(() => {
        document.title = `${title}| complex up`;
        window.scrollTo(0, 0);
    }, [])
  return (
    <Container wide={wide}>
       {children}
    </Container>
  )
}

export default Page