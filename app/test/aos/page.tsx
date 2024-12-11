'use client'

import {Card} from "primereact/card";

export default function AOSTest() {
  return (
      <div className="space-y-8 p-4">
        {/* div 테스트 */}
        <div data-aos="fade-up" className="p-4 bg-blue-100">
          This is a div
        </div>

        {/* heading 테스트 */}
        <h1 data-aos="fade-up" className="text-2xl font-bold">
          This is a heading
        </h1>

        {/* paragraph 테스트 */}
        <p data-aos="fade-up" className="text-gray-600">
          This is a paragraph
        </p>

        {/* button 테스트 */}
        <button data-aos="fade-up" className="px-4 py-2 bg-blue-500 text-white rounded">
          This is a button
        </button>

        {/* span 테스트 */}
        <span data-aos="fade-up" className="inline-block p-2 bg-green-100">
        This is a span
      </span>

        {/* article 테스트 */}
        <article data-aos="fade-up" className="p-4 bg-gray-100">
          This is an article
        </article>

        {/* section 테스트 */}
        <section data-aos="fade-up" className="p-4 bg-yellow-100">
          This is a section
        </section>

        {/* primereact card 테스트 */}
        <Card data-aos="fade-up" className="p-4 bg-yellow-100">
          This is a primereact card
        </Card>
      </div>
  );
}