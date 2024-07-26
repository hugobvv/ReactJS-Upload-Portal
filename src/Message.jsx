/**
 * Project Name: ES6 Upload Portal
 * File: Message.jsx
 * Author: Hugo Bouvet
 * Year: 2024
 *
 * Description: This file contains two functional components, LoadingMessage and ErrorMessage, 
 *              used to display loading and error messages respectively in the application.
 *
 * Components:
 *    - LoadingMessage: A component that displays a loading message and an animation if loading is in progress.
 *      - Props:
 *          - loading (string): A message indicating the loading status. If the value is "Loading", an animation is displayed.
 * 
 *    - ErrorMessage: A component that displays an error message if one is provided.
 *      - Props:
 *          - msg (string): The error message to display. If null or undefined, no message is displayed.
*/

export function LoadingMessage({loading})
{
  /* Display loading message and animation if loading */
  if (!loading)
    return null;
  return <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    <p className="loadingP">{loading}</p>
    {loading === "Loading" && <div className="loader"></div>}
  </div>
}

export function ErrorMessage({msg}) 
{
  /* Display error message if msg */
  return msg ? <p style={{ marginTop: '10px', color: 'red' }}>{msg}</p> : null;
}