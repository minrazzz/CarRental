export default function () {
  return (
    <article className='flex flex-col items-center justify-center space-y-4  border border-gray-300 p-4'>
      <h1 className='text-4xl'>
        <strong>Terms and Conditions</strong>
      </h1>

      <h2 className='text-2xl'>Welcome to Motinc!</h2>
      <p>
        These terms and conditions outline the rules and regulations for the use of
        car company's Website, located at http://localhost:3000/terms-condition.
      </p>
      <ul className='list-inside list-disc'>
        <li>Fuel should be added by the client itself.</li>
        <li>If the vehicles get damaged then the client should pay the fee.</li>
      </ul>
      <h1> By creating an account you accept these terms and conditions</h1>
    </article>
  )
}
