import React, { Suspense } from 'react';

const SidebarPanelTmp = React.lazy(() => import('./SidebarPanel'));
const ModalTmp = React.lazy(() => import('./Modal'));
const CalendarTmp = React.lazy(() => import('./Calendar'));
const DialogTmp = React.lazy(() => import('./Dialog'));
const ScrollbarTmp = React.lazy(() => import('./Scrollbar'));

export const SidebarPanel = (props) => (<Suspense fallback={<></>}><SidebarPanelTmp {...props} /></Suspense>);
export const Modal = (props) => (<Suspense fallback={<></>}><ModalTmp {...props} /></Suspense>);
export const Calendar = (props) => (<Suspense fallback={<></>}><CalendarTmp {...props} /></Suspense>);
export const Dialog = (props) => (<Suspense fallback={<></>}><DialogTmp {...props} /></Suspense>);
export const Scrollbar = (props) => (<Suspense fallback={<></>}><ScrollbarTmp {...props} /></Suspense>);

// Note: React.lazy is for code spliting so, we only requires the component when needed.
// here, fallback could be a loading component like spinner or something.