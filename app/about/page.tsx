// components/About.tsx
'use client'

import { Avatar } from 'primereact/avatar'
import { Card } from 'primereact/card'
import { Chip } from 'primereact/chip'
import { ProgressBar } from 'primereact/progressbar'
import { Timeline } from 'primereact/timeline'

const About = () => {
    const experiences = [
        {
            date: '2022 - Present',
            title: 'Senior Full Stack Developer',
            company: 'Tech Solutions Inc.',
            description: 'Leading development team for enterprise applications'
        },
        {
            date: '2019 - 2022',
            title: 'Full Stack Developer',
            company: 'Digital Innovations Co.',
            description: 'Developed and maintained multiple web applications'
        },
        {
            date: '2017 - 2019',
            title: 'Frontend Developer',
            company: 'StartUp Labs',
            description: 'Focused on React-based application development'
        }
    ]

    const skills = [
        { name: 'TypeScript', level: 90 },
        { name: 'React', level: 85 },
        { name: 'Node.js', level: 80 },
        { name: 'Next.js', level: 75 },
        { name: 'Python', level: 70 }
    ]

    return (
        <div className="p-6">
            {/* Header Section */}
            <Card className="mb-4">
                <div className="flex flex-column md:flex-row justify-center ">
                    <div className='flex items-center'>
                        <Avatar
                            image="/default-avatar.svg"
                            size="xlarge"
                            shape="circle"
                            className="mb-4 md:mb-0 md:mr-4 w-[200px] h-[200px]"
                        />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold mb-2">John Doe</h1>
                        <h2 className="text-xl opacity-70 mb-4">Full Stack Developer</h2>
                        <div className="flex flex-wrap gap-2">
                            <Chip label="TypeScript" />
                            <Chip label="React" />
                            <Chip label="Node.js" />
                            <Chip label="Next.js" />
                        </div>
                    </div>
                </div>
            </Card>

            {/* About Section */}
            <Card title="About Me" className="mb-4">
                <p className="line-height-3">
                    Passionate full stack developer with 6+ years of experience building scalable web applications.
                    Specialized in TypeScript, React, and Node.js. Always eager to learn new technologies and solve
                    complex problems. When not coding, you'll find me contributing to open source projects or
                    mentoring junior developers.
                </p>
            </Card>

            {/* Skills Section */}
            <Card title="Skills" className="mb-4">
                <div className="grid">
                    {skills.map((skill) => (
                        <div key={skill.name} className="col-12 md:col-6 mb-4">
                            <div className="mb-2">
                                <span className="font-medium">{skill.name}</span>
                                <span className="opacity-70 ml-2">{skill.level}%</span>
                            </div>
                            <ProgressBar value={skill.level} showValue={false} />
                        </div>
                    ))}
                </div>
            </Card>

            {/* Experience Timeline */}
            <Card title="Professional Experience" className="mb-4">
                <Timeline
                    value={experiences}
                    content={(item) => (
                        <div className="ml-4">
                            <h3 className="font-bold mb-2">{item.title}</h3>
                            <p className="opacity-70 mb-1">{item.company}</p>
                            <p className="line-height-3">{item.description}</p>
                        </div>
                    )}
                    opposite={(item) => (
                        <div className="opacity-70 font-medium">
                            {item.date}
                        </div>
                    )}
                />
            </Card>

            {/* Contact Section */}
            <Card title="Contact" className="mb-4">
                <div className="grid">
                    <div className="col-12 md:col-4 mb-4">
                        <p className="font-medium mb-2">Email</p>
                        <p className="opacity-70">john.doe@example.com</p>
                    </div>
                    <div className="col-12 md:col-4 mb-4">
                        <p className="font-medium mb-2">Location</p>
                        <p className="opacity-70">Seoul, South Korea</p>
                    </div>
                    <div className="col-12 md:col-4 mb-4">
                        <p className="font-medium mb-2">Github</p>
                        <p className="opacity-70">github.com/johndoe</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default About