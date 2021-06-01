import React, { Component, useEffect, useRef } from 'react';


interface CommentsProps {
  repo: string;
  issueTitle: string;
  theme: string;
  label: string
}

export default function Comments({ repo, issueTitle, theme, label }: CommentsProps) {

  return (
    <section
      ref={elem => {
        if (!elem) {
          return;
        }
        const scriptElem = document.createElement('script');
        scriptElem.src = 'https://utteranc.es/client.js';
        scriptElem.async = true;
        scriptElem.crossOrigin = 'anonymous';
        scriptElem.setAttribute('repo', repo);
        scriptElem.setAttribute('issue-term', issueTitle);
        scriptElem.setAttribute('label', label);
        scriptElem.setAttribute('theme', theme);
        elem.appendChild(scriptElem);
      }}
    />
  );
}
