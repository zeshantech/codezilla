"use client";

import { UserCertificate } from "@/types/profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ExternalLinkIcon } from "lucide-react";

interface ProfileCertificatesProps {
  certificates: UserCertificate[];
}

export function ProfileCertificates({
  certificates,
}: ProfileCertificatesProps) {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Certificates</CardTitle>
          <CardDescription>
            Certificates earned by completing courses and challenges
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certificates.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="overflow-hidden pt-0">
                  <div className="aspect-video bg-muted relative">
                    <img
                      src={
                        certificate.imageUrl || "/certificates/placeholder.png"
                      }
                      alt={certificate.name}
                      className="object-cover h-full w-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/certificates/placeholder.png";
                      }}
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{certificate.name}</CardTitle>
                    <CardDescription>{certificate.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>Earned: {formatDate(certificate.earnedAt)}</span>
                      {certificate.expiresAt && (
                        <Badge variant="outline" className="ml-2">
                          Expires: {formatDate(certificate.expiresAt)}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-semibold">Credential ID:</span>{" "}
                      {certificate.credentialId}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      size="sm"
                      className="ml-auto"
                      href={certificate.credentialUrl}
                      rel="noopener noreferrer"
                    >
                      Verify <ExternalLinkIcon />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <svg
                  className="h-6 w-6 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-lg mb-1">No certificates yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Complete courses and challenges to earn certificates that
                showcase your skills
              </p>
              <Button>Browse available courses</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
